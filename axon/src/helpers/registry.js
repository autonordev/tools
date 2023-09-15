const path = require('node:path')
const fs = require('node:fs')

const axHome = require('../utilities/axHome')
const regPath = path.resolve(axHome(), 'registry.json')

module.exports = {
  getRegistry: () => {
    if (!fs.existsSync(regPath)) {
      return {}
    }

    const data = fs.readFileSync(regPath, 'utf-8')
    const registry = JSON.parse(data)
    return registry
  },

  saveRegistry: (object) => {
    const json = JSON.stringify(object)
    fs.writeFileSync(regPath, json, 'utf-8')
  },

  regPath
}
