/* eslint-disable security/detect-object-injection */
// Search for project.toml and package.toml files

const fs = require('node:fs')
const path = require('node:path')
const { walk } = require('@root/walk')

const tomlParseSafe = require('../../utilities/tomlParseSafe')
const normaliseInclude = require('../../utilities/normaliseInclude')
const resolvePath = require('../../utilities/resolvePath')
const { projectSchema, packageSchema } = require('../../helpers/schema')

// need to be in all lowercase
const GAFFER_FILENAMES = ['project.toml', 'package.toml']

module.exports = async (state, filter = false) => {
  // 1. Discover all relevant files
  const interestedFiles = []
  const walkFunc = async (err, pathName, dirent) => {
    if (err) return false

    if (
      dirent.isFile() &&
      GAFFER_FILENAMES.includes(dirent.name.toLowerCase())
    ) {
      interestedFiles.push(path.resolve(process.cwd(), pathName))
    }
  }

  await walk(state.root, walkFunc)

  state.index = new Map()
  state.projectNames = []
  state.packageMapByPath = new Map()

  // 2. Parse and handle these files
  for (const filePath of interestedFiles) {
    const fileName = path.basename(filePath)
    const isProject = fileName.toLowerCase() === 'project.toml'
    const isPackage = fileName.toLowerCase() === 'package.toml'

    // guard against god knows what
    if (!isProject && !isPackage)
      throw new Error(
        `[G001] \`${filePath}\` is neither a project nor package file`
      )
    if (isProject && isPackage)
      throw new Error(
        `[G002] \`${filePath}\` is both a project and package file.`
      )

    // read and process the file
    let scheme = await tomlParseSafe(
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.readFileSync(filePath, 'utf-8')
    ).catch((err) => {
      throw new Error(
        `[G003] Scheme file \`${filePath}\` could not be read: ${err.message}`
      )
    })

    // validate and parse files
    if (isProject) {
      const { value, error } = projectSchema.validate(scheme)
      if (error)
        throw new Error(
          `[G004] Project \`${filePath}\` could not be parsed: ${error.message}`
        )
      scheme = value
    }
    if (isPackage) {
      const { value, error } = packageSchema.validate(scheme)
      if (error)
        throw new Error(
          `[G004] Package \`${filePath}\` could not be parsed: ${error.message}`
        )
      scheme = value
    }

    scheme.path = path.dirname(filePath)
    scheme.isPackage = isPackage
    scheme.isProject = isProject

    // additional file handling (eg. filtering)
    if (isProject) {
      // Project filtering
      if (filter !== false && !filter.includes(scheme.name)) continue

      // resolve output paths
      scheme.outputs.project = await resolvePath(
        scheme.outputs.project,
        scheme.path,
        state.root
      )
      if (scheme.outputs.build !== false)
        scheme.outputs.build = await resolvePath(
          scheme.outputs.build,
          scheme.path,
          state.root
        )
    }

    // protect against duplicate names
    if (state.index.has(scheme.name))
      throw new Error(
        `[G005] \`${filePath}\`'s name (${
          scheme.name
        }) is already in use by \`${state.index.get(scheme.name).path}\``
      )
    // don't let people name their project/package the workspace name
    if (scheme.name === state.workspace.name) {
      throw new Error(
        `[G005] \`${filePath}\`'s name (${scheme.name}) is already in use by workspace file.`
      )
    }

    // normalise include paths
    for (const key in scheme.includes || []) {
      const include = scheme.includes[key]
      scheme.includes[key] = await normaliseInclude(
        include,
        scheme.path,
        state.root
      )
    }

    // add this entry to the index
    state.index.set(scheme.name, scheme)
    if (isPackage) state.packageMapByPath.set(scheme.path, scheme.name)
    if (isProject) state.projectNames.push(scheme.name)
  }

  return true
}
