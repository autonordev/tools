const discover = require('./discover')
const init = require('./init')

module.exports = async (filter) => {
  const state = await init()
  await discover(state, filter)
  return state
}
