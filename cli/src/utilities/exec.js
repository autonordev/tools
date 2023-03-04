const process = require('node:process')
const shell = require('shelljs')

module.exports = (command, cwd = process.cwd()) => {
  return new Promise((resolve, reject) => {
    const out = shell.exec(command, { silent: true, cwd })

    if (out.stderr) reject(out.stderr.trim())
    else resolve(out.stdout.trim())
  })
}
