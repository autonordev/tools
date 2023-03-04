// Identifies the workspace file and root directory, and pulls the workspace config

const fs = require('node:fs')
const path = require('node:path')

const tomlParseSafe = require('../../utilities/tomlParseSafe')
const { workspaceSchema } = require('../../helpers/schema')

async function searchDirectory(dir) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
    if (file.isFile() && file.name.toLowerCase() === 'workspace.toml') {
      return path.resolve(dir, file.name)
    }
  }

  return null
}

function searchFromDirectory(dir) {
  const run = async () => {
    const result = await searchDirectory(dir)
    const nextDir = path.dirname(dir)

    if (nextDir && result === null) {
      // Only continue if this is *not* the root path (e.g. /, or C:\)
      const relative = path.relative(path.dirname(nextDir), nextDir)
      const isSub =
        relative && !relative.startsWith('..') && !path.isAbsolute(relative)

      if (isSub) return await searchFromDirectory(nextDir)
    }

    return result
  }

  return run()
}

module.exports = async (state = {}) => {
  // 1. Find the configuration file
  const configPath = await searchFromDirectory(process.cwd())
  if (configPath === null) {
    throw new Error('[G006] Could not locate a workspace.toml file')
  }

  // 2. Consider that configuration file the root directory
  state.root = path.dirname(configPath)

  // 3. Load the configuration file and add it into the state
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const configRaw = fs.readFileSync(configPath, 'utf-8')
  const configObject = await tomlParseSafe(configRaw).catch((err) => {
    throw new Error(
      `[G003] Workspace file \`${configPath}\` could not be read: ${err.message}`
    )
  })
  const { value: config, error } = workspaceSchema.validate(configObject)
  if (error)
    throw new Error(
      `[G004] Workspace file \`${configPath}\` could not be parsed: ${error.message}`
    )
  state.workspace = config
  state.workspace.path = configPath

  return state
}
