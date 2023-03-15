const path = require('node:path')

module.exports = async (input, dirname, root) => {
  // Relative (e.g. ../my-package)
  if (!path.isAbsolute(input)) {
    return path.resolve(dirname, input)
  }

  // Absolute (e.g. //pkg/my-package)
  if (input.startsWith('//')) {
    return path.resolve(root, input.replace('//', './'))
  }

  // Absolute path already
  return path.resolve(input)
}
