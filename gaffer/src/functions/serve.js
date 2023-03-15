const escape = require('../utilities/escape')
const exec = require('../utilities/exec')

module.exports = async (projectPath) => {
  await exec(`rojo serve "${escape(projectPath)}"`, false)
}
