const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { getRegistry, regPath } = require('../helpers/registry')
const log = require('../helpers/log')

module.exports = (program) => {
  program
    .command('registry')
    .description('Outputs the current registry')
    // TODO: Clean option, removes invalid entries from the registry
    .action(async () => {
      const registry = getRegistry()
      log.info(`Registry location: ${chalk.blue(regPath)}`)
      log.info('Registry entries:')

      for (const entry in registry) {
        const addendum = []
        const { path: entryPath } = registry[entry]

        if (entryPath) {
          const valid = fs.existsSync(path.join(entryPath, 'axon.json'))
          addendum.push(`  • Path: ${chalk.blue(entryPath)}`)
          addendum.push(
            `    Valid: ${valid ? chalk.green('Yes') : chalk.red('No')}`
          )
        }

        console.log(` ${chalk.magenta(entry)}:\n${addendum.join('\n')}`)
      }
    })
}
