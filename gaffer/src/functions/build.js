const fs = require('node:fs')
const path = require('node:path')
const update = require('./update')
const log = require('../helpers/log')
const escape = require('../utilities/escape')
const exec = require('../utilities/exec')

const WARN_BYTES = 89 * 1e6
const NOTICE_BYTES = 86 * 1e6

const execute = (projectPath, buildPath) =>
  exec(`rojo build --output "${escape(buildPath)}" "${escape(projectPath)}"`)

const sizeWarning = (projectName, size, buildPath) => {
  const isXML = path.extname(buildPath).toLowerCase().endsWith('x')
  const addendum = isXML
    ? ' Consider using a binary file instead of an XML file to reduce file sizes.'
    : ''

  if (size > WARN_BYTES) {
    const overBy = size - WARN_BYTES
    log.warn(
      `[G012] Built file \`${projectName}\` exceeds Roblox's maximum file size (${WARN_BYTES} bytes) by ${overBy} bytes.` +
        addendum
    )
  } else if (size > NOTICE_BYTES) {
    const remaining = WARN_BYTES - size
    log.notice(
      `[G012] Built file \`${projectName}\` is ${remaining} bytes away from exceeding Roblox's maximum file size limit (${WARN_BYTES} bytes).` +
        addendum
    )
  }
}

module.exports = async (filter) => {
  const state = await update(filter).catch((err) => log.error(err.message))
  if (!state) return false

  const builtProjects = []

  for (const projectName of state.projectNames) {
    const project = state.schemes.get(projectName)
    const buildPath = project.outputs.build
    const projectPath = project.outputs.project
    if (buildPath === false) {
      log.notice(
        `Project \`${projectName}\` was not built as it has no build output.`
      )
      continue
    }

    // TODO: Maybe use concurrently here to reduce run times, especially for larger workspaces
    await execute(projectPath, buildPath)
      .then(() => {
        builtProjects.push(projectName)

        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const { size } = fs.statSync(buildPath)
        sizeWarning(projectName, size, buildPath)
      })
      .catch((err) =>
        log.error(
          `[G010] Project \`${projectName}\` could not be built: ${err}`
        )
      )
  }

  return {
    builtProjects,
    state
  }
}
