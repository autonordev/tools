const path = require('node:path')
const fs = require('node:fs')

const transformProperties = require('./properties')
const hasChildren = require('./hasChildren')

// NOTE: This is intentionally deviant from the resolvePath utility
const resolvePath = (
  input,
  { rootPath, outputPath, divergentPaths, includePath }
) => {
  if (!input || typeof input !== 'string') return input

  // double slash is used to signify 'go to root'
  if (input.startsWith('//')) {
    const absolutePath = path.join(rootPath, input.replace('//', './'))
    return path.relative(outputPath, absolutePath)
  } else if (!path.isAbsolute(input) && divergentPaths) {
    // if the path leads to something outside the workspace, we'll make it an absolute path
    const absolutePath = path.resolve(includePath, input)
    if (path.relative(rootPath, absolutePath).startsWith('..'))
      return absolutePath

    return path.relative(outputPath, absolutePath)
  }

  // if it's absolute, or we're in the output directory, no transforming needed
  return input
}

const _handlePullFile = (node, filePath, pathData) => {
  const { rootPath, includePath } = pathData
  const fileName = path.parse(filePath).name

  // TODO: List of files to ignore, etc.
  if (fileName === '.gitkeep') return

  if (node[fileName] && node[fileName].$path) {
    throw new Error(
      `[Gxxx] Attempted to pull ${filePath} as ${fileName} but there is a name collision`
    )
  }

  let usePath
  if (path.relative(rootPath, filePath).startsWith('..')) {
    usePath = filePath
  } else {
    usePath = path.relative(includePath, filePath)
  }

  if (!node[fileName]) node[fileName] = {}
  node[fileName].$path = usePath
}

const handlePull = (node, pullFrom, pathData) => {
  const { outputPath } = pathData
  const absolutePath = path.resolve(outputPath, pullFrom)
  let usePath = absolutePath

  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `[Gxxx] Attempted to pull ${absolutePath} but path does not exist`
    )
  }

  const ent = fs.lstatSync(absolutePath)
  const isDirectory = ent.isDirectory()
  const isSymlink = ent.isSymbolicLink()

  // resolve symlinks
  if (isSymlink) {
    /*
      TODO: Rojo will follow symlinks so we don't need to use absolute paths.
      We need to resolve them for node.fs to be able to get the data, but Rojo
      doesn't need that. This would, however, increase the complexity of the
      pulls functions.
    */
    const linkName = fs.readlinkSync(absolutePath)
    usePath = path.resolve(absolutePath, linkName)
  }

  if (isDirectory || isSymlink)
    for (const file of fs.readdirSync(usePath)) {
      const filePath = path.join(absolutePath, file)
      _handlePullFile(node, filePath, pathData)
    }
  else _handlePullFile(node, absolutePath, pathData)
}

const transformNode = (parentNode, projectPath, includePath, rootPath) => {
  const outputPath = path.dirname(projectPath)
  const divergentPaths = outputPath !== includePath

  for (const nodeKey in parentNode) {
    // Ignore keys like $className, $properties
    // They should be handled within a node itself
    if (nodeKey.startsWith('$')) continue

    let node = parentNode[nodeKey]
    const pathData = {
      rootPath,
      outputPath,
      divergentPaths,
      includePath
    }

    // Item: "./path-to-item"
    if (typeof node === 'string') {
      node = {
        $path: node
      }
    }

    // #region
    /*
      Rojo will infer className from the node key if it's a service. Otherwise, we'll need to infer
      it ourselves. Previously, this used to be a lot of complicated code to identify if it was a
      service or not and only put the $className if it was necessary. But this code was super
      fragile and had a lot of unnecessary moving parts. So this is here instead; I'd rather
      redundant className definitions than broken ones.

      This also, previously, would assume Folder if a node: (a) had children and (b) did not have
      a $path. However, this was disabled because it was making some services folders lol.
    */
    // #endregion
    if (node.$path === undefined && node.$className === undefined) {
      if (!hasChildren(node)) node.$className = nodeKey
      // else node.$className = 'Folder'
    }

    if (node.$path) node.$path = resolvePath(node.$path, pathData)
    if (node.$properties) transformProperties(node.$properties)

    if (node.$pulls) {
      let pulls = node.$pulls
      if (!Array.isArray(pulls)) pulls = [node.$pulls]

      for (const i in pulls) {
        const input = pulls[i]
        const pullFrom = resolvePath(input, pathData)
        handlePull(node, pullFrom, pathData)
      }

      delete node.$pulls
    }

    // And now transform the children of this node
    parentNode[nodeKey] = transformNode(
      node,
      projectPath,
      includePath,
      rootPath
    )
  }

  return parentNode
}

module.exports = transformNode
