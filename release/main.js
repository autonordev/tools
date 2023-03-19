/* eslint-disable security/detect-object-injection */

const path = require('node:path')
const ZipArchive = require('adm-zip')
const semver = require('semver')
const { exec } = require('pkg')

const constants = require('./constants')

// TODO: Maybe infer {version} from package.json instead?
// Or just update package.json's version?
// N.B. package.json's version is what is consumed by the CLI itself

async function main({ toolName, version }) {
  const tool = constants.TOOLS[toolName]
  if (!tool) throw new Error(`Invalid tool: ${toolName}`)
  if (!semver.valid(version)) throw new Error(`Invalid version: ${version}`)
  if (version.startsWith('v'))
    throw new Error(
      `Invalid version: ${version}. Versions must most not be prefixed with a v.`
    )

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
