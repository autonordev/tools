/* eslint-disable security/detect-object-injection, security/detect-non-literal-fs-filename */
const path = require('node:path')
const fs = require('node:fs')
const jsonc = require('comment-json')
const { merge } = require('lodash')

const log = require('../../helpers/log')

const importJson = (jsonPath) => {
  if (fs.existsSync(jsonPath)) {
    const input = fs.readFileSync(jsonPath, 'utf-8')
    const data = jsonc.parse(input, null, true)
    return data
  }
}

const baseTree = importJson(path.resolve(__dirname, 'base-tree.json'))

const importTree = (scheme) => {
  const treePath = path.resolve(scheme.path, 'tree.json')
  if (fs.existsSync(treePath)) {
    return importJson(treePath) || {}
  }
  return {}
}

const hasObjectChildren = (node) => {
  if (typeof node !== 'object') return false
  for (const key in node) {
    if (!key.startsWith('$')) return true
  }
  return false
}

const transformProperties = (properties) => {
  for (const name in properties) {
    const value = properties[name]
    if (typeof value === 'object') {
      // Used on properties that are a Color3 type, but when we'd like to write them in RGB
      if (value.Color3RGB) {
        const rgb = value.Color3RGB
        value.Color3 = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255]
        value.Color3RGB = undefined
      }
    }
  }
}

const transformNode = (parentNode, projectPath, includePath, rootPath) => {
  const outputPath = path.dirname(projectPath)
  const divergentPaths = outputPath !== includePath
  const relativePath = divergentPaths && path.relative(outputPath, includePath)
  const relativeRoot = path.relative(outputPath, rootPath)

  for (const nodeKey in parentNode) {
    // Ignore keys like $className, $properties
    // They should be handled within a node itself
    if (nodeKey.startsWith('$')) continue

    let node = parentNode[nodeKey]

    // Item: "./path-to-item"
    if (typeof node === 'string') {
      node = {
        $path: node
      }
    }

    // Rojo will infer className from the node key if it's a service. Otherwise, we'll need to infer
    // it ourselves if it's a childless node. Previously, this used to be a lot of complicated code
    // to identify if it was a service or not and only put the $className if it was necessary
    // But this code was super fragile and had a lot of unnecessary moving parts. So this is here
    // instead; I'd rather redundant className definitions than broken ones lol
    if (node.$path === undefined && !hasObjectChildren(node)) {
      if (node.$className === undefined) node.$className = nodeKey
    }

    if (node.$properties) transformProperties(node.$properties)

    // we need to reconcile these paths so that way it all still works
    if (node.$path && node.$path.startsWith('//'))
      node.$path = path.join(relativeRoot, node.$path.replace('//', './'))
    if (node.$path && divergentPaths && !path.isAbsolute(node.$path)) {
      node.$path = path.join(relativePath, node.$path)
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

module.exports = async (state) => {
  for (const projectName of state.projectNames) {
    // 1. Import project's tree.json files
    const trees = []
    const project = state.schemes.get(projectName)

    // Include the base tree and project specific tree
    trees.push(
      transformNode(baseTree, project.outputs.project, __dirname, state.root)
    )
    trees.push(
      transformNode(
        importTree(project),
        project.outputs.project,
        project.path,
        state.root
      )
    )

    // 2. Bring in include's tree.json files
    for (const includeName of project.includes) {
      const include = state.schemes.get(includeName)
      trees.push(
        transformNode(
          importTree(include),
          project.outputs.project,
          include.path,
          state.root
        )
      )
    }

    // 3. Merge the trees and transform them
    const tree = merge({}, ...trees)

    // 4. Include tree into rojo configuration
    const rojoProject =
      importJson(path.resolve(project.path, 'rojo.json')) || {}

    if (!rojoProject.name) rojoProject.name = project.name
    if (rojoProject.tree)
      log.warn(
        `[G011] Project \`${project.name}\`'s rojo.json file has \`tree\` set. Note that this key is overwritten entirely by Gaffer and is ignored.`
      )
    rojoProject.tree = tree

    // 5. Create file
    fs.writeFileSync(
      project.outputs.project,
      JSON.stringify(rojoProject),
      'utf-8'
    )
  }

  return state
}
