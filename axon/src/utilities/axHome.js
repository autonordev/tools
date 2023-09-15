// Gets the user's axon home directory. Creates the directory if it doesn't exist.

const os = require('node:os')
const path = require('node:path')
const fs = require('node:fs')

module.exports = () => {
  const homedir = os.homedir()
  const axHome = path.join(homedir, '.axon')

  if (!fs.existsSync(axHome)) {
    fs.mkdirSync(axHome)
  }

  return axHome
}
