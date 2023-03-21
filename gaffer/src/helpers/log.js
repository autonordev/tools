const chalk = require('chalk')

const logLevels = {
  verbose: 0,
  trace: 1,
  info: 2,
  warn: 3,
  error: 4
}

const makePrefix = (slot) =>
  chalk.bold.cyan('gaffer ') + chalk.gray('[') + slot + chalk.gray(']')

const level = logLevels.verbose

module.exports = {
  levels: logLevels,

  verbose: (message) => {
    if (level <= logLevels.verbose)
      console.log(makePrefix(chalk.magenta('verbose')), message)
  },

  trace: (message) => {
    if (level <= logLevels.trace)
      console.log(makePrefix(chalk.blue('trace')), message)
  },

  info: (message) => {
    if (level <= logLevels.info)
      console.log(makePrefix(chalk.greenBright('info')), message)
  },

  warn: (message) => {
    if (level <= logLevels.warn)
      console.log(makePrefix(chalk.yellow('WARN')), message)
  },

  error: (message) => {
    if (level <= logLevels.warn)
      console.log(makePrefix(chalk.red('ERR!')), message)
  }
}
