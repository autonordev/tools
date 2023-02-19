const shell = require('shelljs')

module.exports = (command) => {
  try {
    const out = shell.exec(command, { silent: true })

    if (out.stderr) {
      throw new Error(out.stderr.trim())
    }
    return undefined
  } catch (err) {
    return err
  }
}
