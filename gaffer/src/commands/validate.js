const setup = require('../functions/setup')
const reduce = require('../functions/reduce')
const log = require('../helpers/log')

module.exports = (program) => {
  program
    .command('validate')
    .description('Validates the current workspace and its schemes')
    .action(async () => {
      try {
        const state = await setup()
        await reduce(state)

        log.info(`Workspace \`${state.workspace.name}\` is valid!`)
        log.trace(
          'Note that this process does not validate tree or rojo.json files'
        )
      } catch (err) {
        log.error(err.message)
      }
    })
}
