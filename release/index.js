// CLI entry point

const main = require('./main')

const toolName = process.argv[2]
const version = process.argv[3]

main({ toolName, version })
