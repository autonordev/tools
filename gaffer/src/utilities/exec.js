const process = require('node:process')
const shell = require('shelljs')

module.exports = (command, silent = true, cwd = process.cwd()) => {
  return new Promise((resolve, reject) => {
    const out = shell.exec(command, { silent, cwd })

    if (out.stderr) reject(out.stderr.trim())
    else resolve(out.stdout.trim())
  })
}
