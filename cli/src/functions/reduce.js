/* eslint-disable security/detect-object-injection */
const path = require('node:path')
const { uniq } = require('lodash')

const flatten = (index, project, parent, meta) => {
  for (const includeName of parent.includes) {
    const include = index.get(includeName)
    if (!project.includes.includes(includeName))
      project.includes.push(includeName)
    flatten(index, project, include, includeName)
  }
}

const resolveInclude = (state, parent, include) => {
  // a) Identify the package's name
  let packageName = include
  if (path.isAbsolute(include))
    packageName = state.packageMapByPath.get(include)

  // c) Verify it's valid
  const includedPackage = state.index.get(packageName)
  if (!includedPackage)
    throw new Error(
      `[G007] Include \`${include}\` (found in ${parent.path}) could not be resolved.`
    )

  // d) Validate that it's (i) a package; (ii) not this package
  if (!includedPackage.isPackage)
    throw new Error(
      `[G008] Included scheme \`${include}\` (found in ${parent.path}) is not a package.`
    )
  if (includedPackage.name === parent.name)
    throw new Error(
      `[G009] Package \`${include}\` (found in ${parent.path}) includes itself.`
    )

  return packageName
}

module.exports = async (state) => {
  // 1. Resolve includes (on all schemes) to just their names
  for (const scheme of state.index.values()) {
    for (const i in scheme.includes) {
      const include = scheme.includes[i]
      scheme.includes[i] = resolveInclude(state, scheme, include)
    }
  }

  // 2. Flatten the 'include tree' for projects
  for (const projectName of state.projectNames) {
    const project = state.index.get(projectName)

    // Bring all workspace includes into our projects
    state.workspace.includes.forEach((include) =>
      project.includes.push(resolveInclude(state, state.workspace, include))
    )

    for (const includeName of project.includes) {
      const include = state.index.get(includeName)
      if (!project.includes.includes(includeName))
        project.includes.push(includeName)
      flatten(state.index, project, include, 'root')
    }

    project.includes = uniq(project.includes)
  }

  return true
}
