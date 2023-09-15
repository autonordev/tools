const path = require('node:path')
const fs = require('node:fs')

module.exports = (dir) => {
  const links = []
  for (const file of fs.readdirSync(dir)) {
    const absolute = path.resolve(dir, file)
    const stat = fs.lstatSync(absolute)
    console.log(absolute, stat.isSymbolicLink()) // XXX:
    if (stat.isSymbolicLink) links.push(absolute)
  }
  return links
}
