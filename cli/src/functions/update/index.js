const init = require('./init')
const discover = require('./discover')
const reduce = require('./reduce')
const transform = require('./transform')

module.exports = async (filter) => {
  const state = await init()
  await discover(state, filter)
  await reduce(state)
  return await transform(state)
}
