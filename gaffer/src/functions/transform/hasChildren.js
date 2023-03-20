const hasObjectChildren = (node) => {
  if (typeof node !== 'object') return false
  if (node.$pulls) return true
  if (node.$path) return true
  for (const key in node) {
    if (!key.startsWith('$')) return true
  }
  return false
}

module.exports = hasObjectChildren
