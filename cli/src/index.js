#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()

const { description, version } = require('../package.json')

program.name('gaffer').description(description).version(version)

require('./commands')(program)

program.parse()
