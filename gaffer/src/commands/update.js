const update = require('../functions/update')
const completionMessage = require('../utilities/completionMessage')
const log = require('../helpers/log')

module.exports = (program) => {
  program
    .command('update')
    .description('Create and/or update Rojo project files')
    .argument(
      '[projects...]',
      'an optional, space delimited list of projects; if provided, only these projects will be updated',
      false
    )
    .action(async (filter) => {
      const state = await update(filter).catch((err) => log.error(err.message))
      if (state) completionMessage('updated', state.projectNames)
    })
}
