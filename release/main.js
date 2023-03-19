/* eslint-disable security/detect-non-literal-require, security/detect-object-injection, security/detect-non-literal-fs-filename */

const path = require('node:path')
const fs = require('node:fs')
const ZipArchive = require('adm-zip')
const semver = require('semver')
const { exec } = require('pkg')

const constants = require('./constants')

async function main({ toolName, version }) {
  const tool = constants.TOOLS[toolName]
  if (!tool) throw new Error(`Invalid tool: ${toolName}`)
  if (!semver.valid(version)) throw new Error(`Invalid version: ${version}`)
  if (version.startsWith('v'))
    throw new Error(
      `Invalid version: ${version}. Versions must not be prefixed with a v.`
    )

  // Read, validate, and (if necessary) overwrite package.json
  const toolPackage = path.resolve(tool.path, 'package.json')
  const packageData = require(toolPackage)
  if (packageData.version !== version) {
    console.warn(`${'*'.repeat(64)}
${toolPackage}'s version is set to ${packageData.version} but
release script has been ran with version ${version}!
The package.json version will be overwritten for this release.
${'*'.repeat(64)}`)

    packageData.version = version
    fs.writeFileSync(toolPackage, JSON.stringify(packageData), 'utf-8')
  }

  // Build tool
  for (const outputTarget in constants.TARGETS) {
    const buildTarget = constants.TARGETS[outputTarget]
    const ext = buildTarget.startsWith('win-') ? '.exe' : ''

    const output = path.resolve(
      __dirname,
      `../build/${toolName}-${version}/${outputTarget}/${toolName}${ext}`
    )

    const args = [
      tool.path,
      `--target ${buildTarget}`,
      `--output ${output}`,
      '--no-bytecode',
      '--public-packages "*"',
      '-C gzip'
    ]

    // HACK: yea...  pkg ignores spaces within array items
    await exec(args.join(' ').split(' '))

    const zip = new ZipArchive()
    zip.addLocalFile(output)
    await zip.writeZipPromise(
      path.resolve(
        __dirname,
        `../build/zip/${toolName}-${version}-${outputTarget}.zip`
      )
    )
  }

  // Add the source code
  const zip = new ZipArchive()
  await zip.addLocalFolderPromise(tool.path, {
    filter: (filename) =>
      !(filename.startsWith('example/') || filename.startsWith('node_modules/'))
  })

  await zip.writeZipPromise(
    path.resolve(__dirname, `../build/zip/${toolName}-${version}-source.zip`)
  )

  // Provide caller the folder containing our zip artefacts
  return path.resolve(__dirname, `../build/zip`)
}

module.exports = main
