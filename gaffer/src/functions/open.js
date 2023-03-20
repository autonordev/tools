const { execSync } = require('child_process')
const os = require('node:os')
const log = require('../helpers/log')

module.exports = async (buildPath) => {
  switch (os.type()) {
    case 'Windows_NT':
      execSync(`start ${buildPath}`)
      break
    case 'Darwin':
      execSync(`open ${buildPath}`)
      break
    case 'Linux':
      log.warn(
        `[Gxxx] Note that Linux support is limited both for Gaffer and Roblox.`
      )
      execSync(`xdg-open ${buildPath}`)
      break
    default:
      throw new Error(
        `[Gxxx] Your operating system (${os.type()}) is not supported by this command.`
      )
  }
}
