const completionMessage = require('../utilities/completionMessage')
const build = require('../functions/build')

module.exports = (program) => {
  program
    .command('build')
    .description('Update and build projects')
    .argument(
      '[projects...]',
      'an optional, space delimited list of projects; if provided, only these projects will be built',
      false
    )
    .action(async (filter) => {
      const { builtProjects } = await build(filter)
      if (builtProjects !== false) completionMessage('built', builtProjects)
    })
}
