/* eslint-disable security/detect-unsafe-regex */
const Joi = require('joi')

// common schema values
const name = Joi.string()
  // Regex allows for alphanumeric characters (lowercase)
  // and (except for at the start) dashes, underscores, and slashes
  .regex(/^[a-z0-9]+(?:[-_/][A-Za-z0-9]+)*$/)
  .required()
const includes = Joi.array().items(Joi.string()).default([])
const edition = Joi.number().valid(0).required()

const workspaceSchema = Joi.object().keys({
  name,
  edition,
  includes
})

const projectSchema = Joi.object().keys({
  name,
  includes,
  edition,
  outputs: Joi.object()
    .keys({
      build: Joi.alternatives(Joi.string(), Joi.valid(false)).required(),
      project: Joi.string().default('./.project.json')
    })
    .required()
})

const packageSchema = Joi.object().keys({
  name,
  includes,
  edition
})

module.exports = {
  workspaceSchema,
  projectSchema,
  packageSchema
}
