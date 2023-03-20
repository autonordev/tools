const transformProperties = (properties) => {
  for (const name in properties) {
    const value = properties[name]
    if (typeof value === 'object') {
      // Used on properties that are a Color3 type, but when we'd like to write them in RGB
      // Yes, the Color3 and Color3uint8 types are different types, and are not compatible
      if (value.Color3RGB) {
        const rgb = value.Color3RGB
        value.Color3 = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255]
        value.Color3RGB = undefined
      }
    }
  }
}

module.exports = transformProperties
