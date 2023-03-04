/* eslint-disable security/detect-child-process */

const { execSync } = require('child_process')
const os = require('node:os')
const setup = require('../functions/setup')
const log = require('../helpers/log')

module.exports = (program) => {
  program
    .command('open')
    .description(
      'Opens the built file for the specified workspace, if it exists'
    )
    .argument('<project>', 'the name of the project to open')
    .action(async (projectName) => {
      try {
        const filter = [projectName]
        const state = await setup(filter)

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
