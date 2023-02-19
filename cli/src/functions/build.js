const update = require('./update')
const log = require('../helpers/log')
const escape = require('../utilities/escape')
const exec = require('../utilities/exec')

const execute = (projectPath, buildPath) =>
  exec(`rojo build --output "${escape(buildPath)}" "${escape(projectPath)}"`)

module.exports = async (filter) => {
  const state = await update(filter).catch((err) => log.error(err.message))
  if (!state) return false

  const builtProjects = []

  for (const projectName of state.projectNames) {
    const project = state.index.get(projectName)
    const buildPath = project.outputs.build
    const projectPath = project.outputs.project
    if (buildPath === false) {
      log.notice(
        `Project \`${projectName}\` was not built as it has no build output.`
      )
      continue
    }

    // TODO: Maybe use concurrently here to reduce run times, especially for larger workspaces
    const err = execute(projectPath, buildPath)
    if (err)
      log.error(
        `[G010] Project \`${projectName}\` could not be built: ${err.message}`
      )
    else builtProjects.push(projectName)
  }

  return builtProjects
}
