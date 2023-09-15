const path = require('node:path')
const fs = require('node:fs')
const process = require('node:process')

const log = require('../helpers/log')
const { getRegistry } = require('../helpers/registry')
const schema = require('../helpers/schema')
const importJson = require('../utilities/importJson')
const getLinks = require('../utilities/getLinks')

function resolve(name, registry, state) {
  const entry = registry[name]
  if (!entry)
    throw new Error(
      `Attempted to resolve \`${name}\` but could not find registry entry`
    )

  const { path: includePath } = entry
  if (!fs.existsSync(includePath))
    throw new Error(
      `Registry entry name \`${name}\` is pointed to ${includePath} but that path no-longer exists`
    )

  const manifestPath = path.join(includePath, 'axon.json')
  if (!fs.existsSync(manifestPath))
    throw new Error(
      `Registry entry \`${name}\` is pointed to ${includePath} but that directory no-longer contains an axon.json file`
    )

  const data = importJson(manifestPath)
  const { value, error } = schema.validate(data)
  if (error)
    throw new Error(
      `Registry entry \`${name}\` is pointed to ${includePath}, but that manifest file is no-longer valid: ${error}`
    )
  if (value.name !== name)
    throw new Error(
      `Registry entry \`${name}\` is pointed to ${includePath}, but that manifest file is under a different name (${value.name})`
    )

  if (!fs.existsSync(path.resolve(includePath, value.exports)))
    throw new Error(
      `Manifest file ${manifestPath} for include \`${name}\` exports ${value.exports}, but this path does not exist`
    )

  state[name] = value
  state[name].path = includePath

  for (const subInclude of value.uses) {
    resolve(subInclude, registry, state)
  }
}

function doLink(dir, state) {
  // 1. Remove any symlinks in this folder
  const links = getLinks(dir)
  for (const linkPath of links) {
    fs.unlinkSync(linkPath)
  }

  // 2. Add links according to the state
  for (const include of Object.values(state)) {
    const sanitizedName = include.name
      .trim()
      .toLowerCase()
      .replace(/ +/g, '-')
      .replace(/[^a-z0-9-_]/g, '')

    const mount = path.join(dir, sanitizedName)
    const linkTo = path.resolve(include.path, include.exports)
    log.verbose(`Linking ${mount} to ${linkTo} (include \`${include.name}\`)`)
    fs.symlinkSync(linkTo, mount, 'junction')
  }
}

module.exports = (program) => {
  program
    .command('link')
    .description('Links known dependencies into the specified project')
    .argument('[path]', 'path to a directory with an axon.json file', '')
    .action(async (pathInput) => {
      try {
        const useDir = path.resolve(process.cwd(), pathInput)
        const usePath = path.join(useDir, 'axon.json')
        if (!fs.existsSync(usePath))
          throw new Error('Must link to a directory with an axon.json file')

        const data = importJson(usePath)
        const { value, error } = schema.validate(data)
        if (error) throw error
        console.log(value) // XXX:

        const registry = getRegistry()
        const state = {}

        for (const includeName of value.uses) {
          resolve(includeName, registry, state)
        }

        const depsDir = path.resolve(useDir, 'deps')
        if (!fs.existsSync(depsDir)) fs.mkdirSync(depsDir)

        doLink(depsDir, state)
      } catch (err) {
        log.error(err.message)
      }
    })
}
