const path = require('node:path')

module.exports = {
  TOOLS: { gaffer: { path: path.resolve(__dirname, '../gaffer') } },

  NODE_RANGE: 'node16',

  // What foreman/aftman wants on the left, and what pkg wants on the right.
  // -x86_64 may be added after the os name but this seems optional.
  TARGETS: {
    linux: 'linux-x64',
    // 'macos-aarch64': 'macos-arm64', // disabled due to code signing requirement
    macos: 'macos-x64',
    windows: 'win-x64'
  }
}
