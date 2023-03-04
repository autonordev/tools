const discover = require('./discover')
const init = require('./init')

module.exports = async (filter) => {
  const state = await init()
  return await discover(state, filter)
}
