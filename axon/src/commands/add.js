const path = require('node:path')
const fs = require('node:fs')
const process = require('node:process')

const log = require('../helpers/log')
const { getRegistry, saveRegistry } = require('../helpers/registry')
const schema = require('../helpers/schema')
const importJson = require('../utilities/importJson')

function localPath(pathInput) {
  const includePath = path.resolve(process.cwd(), pathInput)
  const usePath = path.resolve(includePath, 'axon.json')

  if (!fs.existsSync(usePath))
    throw new Error('Must link to a directory with an axon.json file')

  const data = importJson(usePath)
  const { value, error } = schema.validate(data)

  if (error) throw error
  if (!value.name)
    throw new Error(
      'A name is required when loading Axon files into the registry'
    )

  const registry = getRegistry()
  if (registry[value.name]) {
    const oldPath = registry[value.name].path

    if (oldPath === includePath) {
      log.info(`${value.name} is already pointed to ${includePath}`)
      return
    }

    log.trace(`${value.name} is pointed to ${oldPath}. Overwriting...`)
  }

  registry[value.name] = {
    path: includePath
  }
  saveRegistry(registry)

  log.info(`${value.name} added to registry (pointing to ${includePath})`)
}

module.exports = (program) => {
  program
    .command('add')
    .description(
      'Adds an entry into the registry. Must link to a directory or repository with an axon.json file.'
    )
    .option('-p, --path <path>', 'local path to use')
    .option('-g, --git <remote_url>', 'the remote URL to use')
    .action(async (options) => {
      try {
        const { path: pathInput, git } = options
        if (!pathInput && !git)
          throw new Error(`Must specify either path or Git URL.`)

        if (git) throw new Error(`Git is not currently supported.`)
        if (pathInput) localPath(pathInput)
      } catch (err) {
        log.error(err.message)
      }
    })
}
