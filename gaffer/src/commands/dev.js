const log = require('../helpers/log')
const build = require('../functions/build')
const serve = require('../functions/serve')
const open = require('../functions/open')

module.exports = (program) => {
  program
    .command('dev')
    .description('Updates, builds, and opens the specified project')
    .argument('<project>', 'the name of the project')
    .action(async (projectName) => {
      try {
        const { state } = await build([projectName])

        if (state.projectNames.length === 0)
          throw new Error(
            `[Gxxx] Project \`${projectName}\` could not be found.`
          )

        const project = state.schemes.get(projectName)

        log.notice(`Built project \`${project.path}\``)
        await open(project.outputs.build)

        log.success(`Starting Rojo server for \`${project.path}\`\n`)
        await serve(project.outputs.project)
      } catch (err) {
        log.error(err.message)
      }
    })
}
