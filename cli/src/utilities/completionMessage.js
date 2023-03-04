const log = require('../helpers/log')

module.exports = (action, projectNames) => {
  if (projectNames.length === 0)
    log.notice(
      `No projects were ${action}. There are either no projects in the workspace or your filter did not match any projects.`
    )
  else if (projectNames.length === 1)
    log.success(`Project \`${projectNames.join(', ')}\` has been ${action}.`)
  else
    log.success(`Projects \`${projectNames.join(', ')}\` have been ${action}.`)
}
