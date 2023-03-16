/* eslint-disable security/detect-unsafe-regex */
const Joi = require('joi')

// common schema values
const name = Joi.string()
  // Regex allows for alphanumeric characters (lowercase)
  // and (except for at the start) dashes, underscores, dots, and slashes
  .regex(/^[A-Za-z0-9]+(?:[-_/.][A-Za-z0-9]+)*$/)
  .required()
const includes = Joi.array().items(Joi.string()).default([])
const edition = Joi.number().valid(0).required()

const scriptItem = Joi.alternatives(
  Joi.string(),
  Joi.object().keys({
    cmd: Joi.string().required(),
    dir: Joi.string().default('.')
  })
)
const scripts = Joi.object().pattern(/./, [
  scriptItem,
  Joi.array().items(scriptItem)
])

const workspaceSchema = Joi.object().keys({
  name,
  edition,
  includes,
  scripts
})

const projectSchema = Joi.object().keys({
  name,
  includes,
  edition,
  scripts,
  use_base_tree: Joi.bool().default(true),
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
  edition,
  scripts
})

module.exports = {
  workspaceSchema,
  projectSchema,
  packageSchema
}
