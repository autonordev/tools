const shell = require('shelljs')

module.exports = (command, cwd) => {
  try {
    const out = shell.exec(command, { silent: true, cwd })

    if (out.stderr) {
      throw new Error(out.stderr.trim())
    }
    return out.stdout.trim()
  } catch (err) {
    return err
  }
}
