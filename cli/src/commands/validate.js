const init = require('../functions/update/init')
const discover = require('../functions/update/discover')
const reduce = require('../functions/update/reduce')
const log = require('../helpers/log')

module.exports = (program) => {
  program
    .command('validate')
    .description('Validates the current workspace and its schemes')
    .action(async () => {
      try {
        const state = await init()
        await discover(state)
        await reduce(state)

        log.success(`Workspace ${state.workspace.name} is valid!`)
        log.notice(
          'Note that this process does not validate tree or rojo.json files'
        )
      } catch (err) {
        log.error(err.message)
      }
    })
}
