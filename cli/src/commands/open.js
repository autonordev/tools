/* eslint-disable security/detect-child-process */

const { execSync } = require('child_process')
const os = require('node:os')
const log = require('../helpers/log')
const build = require('../functions/build')

module.exports = (program) => {
  program
    .command('open')
    .description(
      'Build the specified project and then opens it in Roblox Studio'
    )
    .argument('<project>', 'the name of the project to open')
    .action(async (projectName) => {
      try {
        const filter = [projectName]
        const { state } = await build(filter)

        if (state.projectNames.length === 0)
          throw new Error(
            `[Gxxx] Project \`${projectName}\` could not be found.`
          )

        const project = state.schemes.get(projectName)
        const buildPath = project.outputs.build

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

        log.success(`Opening file ${buildPath}`)
      } catch (err) {
        log.error(err.message)
      }
    })
}
