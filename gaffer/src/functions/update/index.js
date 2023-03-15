const setup = require('../setup')
const reduce = require('../reduce')
const transform = require('./transform')

module.exports = async (filter) => {
  const state = await setup(filter)
  await reduce(state)
  return await transform(state)
}
