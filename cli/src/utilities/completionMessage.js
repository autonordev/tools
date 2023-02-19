const log = require('../helpers/log')

module.exports = (action, projectNames) => {
  if (projectNames.length === 0)
    log.notice(
      `No projects were ${action}. There are either no projects in the workspace or your filter did not match any projects.`
    )
  else
    log.success(`Projects \`${projectNames.join(', ')}\` have been ${action}.`)
}
