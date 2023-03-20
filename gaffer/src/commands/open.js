const path = require('node:path')
const log = require('../helpers/log')
const build = require('../functions/build')
const open = require('../functions/open')

module.exports = (program) => {
  program
    .command('open')
    .description(
      'Build the specified project and then opens it in Roblox Studio'
    )
    .argument('<project>', 'the name of the project to open')
    .action(async (projectName) => {
      try {
        const { state } = await build([projectName])

        if (state.projectNames.length === 0)
          throw new Error(
            `[Gxxx] Project \`${projectName}\` could not be found.`
          )

        const project = state.schemes.get(projectName)
        const buildPath = project.outputs.build

        const ext = path.extname(buildPath)
        if (ext === 'rbxm' || ext === 'rbxmx') {
          throw new Error(
            `[Gxxx] Project \`${projectName}\` could not be opened, as it outputs a model.`
          )
        }

        await open(buildPath)
        log.info(`Built and opened file \`${buildPath}\``)
      } catch (err) {
        log.error(err.message)
      }
    })
}
