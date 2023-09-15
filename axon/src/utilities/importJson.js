const fs = require('node:fs')
const jsonc = require('comment-json')

const importJson = (jsonPath) => {
  if (fs.existsSync(jsonPath)) {
    const input = fs.readFileSync(jsonPath, 'utf-8')
    const data = jsonc.parse(input, null, true)
    return data
  }
}

module.exports = importJson
