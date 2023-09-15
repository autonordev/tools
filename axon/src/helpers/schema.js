const Joi = require('joi')

const schema = Joi.object().keys({
  name: Joi.string().regex(/^[A-Za-z0-9]+(?:[-_/.][A-Za-z0-9]+)*$/),
  exports: Joi.string().default('./'),
  uses: Joi.array().items(Joi.string()).default([])
})

module.exports = schema
