const path = require('node:path')

module.exports = async (include, dirname, root) => {
  // Relative (e.g. ../my-package)
  if (include.startsWith('.')) {
    return path.resolve(dirname, include)
  }

  // Absolute (e.g. //pkg/my-package)
  if (include.startsWith('//')) {
    return path.resolve(root, include.replace('//', './'))
  }

  // Would be either named or erroneously formatted names
  return include
}
