const toml = require('@iarna/toml')

module.exports = async (input) => {
  return toml.parse(input)
}
