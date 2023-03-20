const path = require('node:path')
const fs = require('node:fs')

const transformProperties = require('./properties')
const hasChildren = require('./hasChildren')

const resolvePath = (
  input,
  { rootPath, outputPath, divergentPaths, includePath }
) => {
  if (input && input.startsWith('//')) {
    const absolutePath = path.join(rootPath, input.replace('//', './'))
    return path.relative(outputPath, absolutePath)
  } else if (input && divergentPaths && !path.isAbsolute(input)) {
    const absolutePath = path.join(includePath, input)
    return path.relative(outputPath, absolutePath)
  }
  return input
}

const _handlePullFile = (node, filePath, outputPath) => {
  const fileName = path.parse(filePath).name
  const relativePath = path.relative(outputPath, filePath)

  if (node[fileName] && node[fileName].$path) {
    console.log(node)
    throw new Error(
      `[Gxxx] Attempted to pull ${filePath} as ${fileName} but there is a name collision`
    )
  }

  if (!node[fileName]) node[fileName] = {}
  node[fileName].$path = relativePath
}

const handlePull = (node, pullFrom, { outputPath, includePath }) => {
  const absolutePath = path.join(includePath, pullFrom)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `[Gxxx] Attempted to pull ${absolutePath} but path does not exist`
    )
  }

  if (fs.lstatSync(absolutePath).isDirectory())
    for (const file of fs.readdirSync(absolutePath)) {
      const filePath = path.join(absolutePath, file)
      _handlePullFile(node, filePath, outputPath)
    }
  else _handlePullFile(node, absolutePath, outputPath)
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

      node.$pulls = undefined
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
