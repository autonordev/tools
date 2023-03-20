/* eslint-disable security/detect-object-injection, security/detect-non-literal-fs-filename */
const path = require('node:path')
const fs = require('node:fs')
const { merge } = require('lodash')
const log = require('../../helpers/log')

const importJson = require('./importJson')
const transformNode = require('./node')

const baseTree = importJson(path.resolve(__dirname, 'base-tree.json'))

const importTree = (scheme) => {
  const treePath = path.resolve(scheme.path, 'tree.json')
  if (fs.existsSync(treePath)) {
    return importJson(treePath) || {}
  }
  return {}
}

module.exports = async (state) => {
  for (const projectName of state.projectNames) {
    // 1. Import project's tree.json files
    const trees = []
    const project = state.schemes.get(projectName)

    // Include the base tree (default)
    if (project.use_base_tree)
      trees.push(
        transformNode(baseTree, project.outputs.project, __dirname, state.root)
      )

    // And now include the project specific tree
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
