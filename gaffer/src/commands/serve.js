const log = require('../helpers/log')
const update = require('../functions/update')
const serve = require('../functions/serve')

module.exports = (program) => {
  program
    .command('serve')
    .description('Updates the specified project and then starts a Rojo server')
    .argument('<project>', 'the name of the project to serve')
    .action(async (projectName) => {
      try {
        const state = await update([projectName])

        if (state.projectNames.length === 0)
          throw new Error(
            `[Gxxx] Project \`${projectName}\` could not be found.`
          )

        const project = state.schemes.get(projectName)
        const projectPath = project.outputs.project

        log.info(`Starting Rojo server for \`${project.path}\`\n`)
        await serve(projectPath)
      } catch (err) {
        log.error(err.message)
      }
    })
}
