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

        await open(buildPath)
        log.success(`Built and opened file \`${buildPath}\``)
      } catch (err) {
        log.error(err.message)
      }
    })
}
