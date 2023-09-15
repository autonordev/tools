const setup = require('../functions/setup')
const log = require('../helpers/log')
const live = require('shelljs-live/promise')
const resolvePath = require('../utilities/resolvePath')

const execute = async ({ entity, root, item, includeNewLine }) => {
  const cmd = typeof item === 'string' ? item : item.cmd
  const dir = await resolvePath(
    typeof item === 'string' ? '.' : item.dir,
    entity.path,
    root,
    entity.mountPoint
  )

  if (includeNewLine === true) console.log('')
  log.trace(`Executing \`${cmd}\` in \`${dir}\``)

  // Separate package because it supports ANSI output and normal shelljs doesn't
  await live(cmd, { cwd: dir }).catch(() => process.exit(1))
}

module.exports = (program) => {
  program
    .command('script') // because the keys are called 'script'
    .alias('run') // parity with node package managers
    .alias('execute') // because it executes
    .alias('ex') // short for execute
    .alias('x') // very short for 'execute', some parity with npx or rushx
    .description('Executes a specified script')
    .argument('<script>', 'the name of the script to execute')
    .option('-s, --scheme <schemeName>', 'execute a scheme-defined script')
    .action(async (scriptName, options) => {
      try {
        const { scheme: name } = options
        const isScheme = name !== undefined
        const { schemes, workspace, root } = await setup()
        const scheme = schemes.get(name)
        const entity = isScheme ? scheme : workspace

        if (isScheme && !scheme)
          throw new Error(`[Gxxx] Scheme \`${name}\` could not be found.`)

        if (isScheme && (!scheme.scripts || !scheme.scripts[scriptName]))
          throw new Error(
            `[Gxxx] Scheme \`${name}\` does not have script \`${scriptName}\``
          )
        else if (
          !isScheme &&
          (!workspace.scripts || !workspace.scripts[scriptName])
        )
          throw new Error(
            `[Gxxx] Workspace \`${workspace.name}\` does not have script \`${scriptName}\``
          )

        const scriptValue = entity.scripts[scriptName]

        // scriptName = scriptValue can be an array of scriptItems or just a scriptItem
        if (Array.isArray(scriptValue))
          for (const i in scriptValue) {
            await execute({
              entity,
              root,
              item: scriptValue[i],
              includeNewLine: i > 0
            })
          }
        else
          await execute({
            entity,
            root,
            item: scriptValue
          })
      } catch (err) {
        log.error(err.message)
      }
    })
}
