#!/usr/bin/env node

'use strict'

const dnsdump = require('./dnsdump')

dnsdump(...process.argv.slice(2)).catch(err => {
  console.error(err.message)
  process.exit(1)
})
