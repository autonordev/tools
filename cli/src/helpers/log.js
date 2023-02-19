const chalk = require('chalk')

const prefix = chalk.bold.cyan('gaffer') + ' '

const logLevels = {
  verbose: 0,
  notice: 1,
  success: 2,
  warn: 3,
  error: 4
}

const level = logLevels.verbose

module.exports = {
  levels: logLevels,

  verbose: (message) => {
    if (level <= logLevels.verbose)
      console.log(prefix + chalk.bgMagenta('verbose'), message)
  },

  notice: (message) => {
    if (level <= logLevels.notice)
      console.log(prefix + chalk.bgBlue('notice'), message)
  },

  success: (message) => {
    if (level <= logLevels.success)
      console.log(prefix + chalk.bgGreenBright.black('success'), message)
  },

  warn: (message) => {
    if (level <= logLevels.warn)
      console.warn(prefix + chalk.bgYellow.black('warning'), message)
  },

  error: (message) => {
    if (level <= logLevels.warn)
      console.error(prefix + chalk.bgRed('error'), message)
  }
}
