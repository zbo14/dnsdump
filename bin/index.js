#!/usr/bin/env node

'use strict'

const dnsdump = require('./dnsdump')

dnsdump(...process.argv.slice(2)).catch(err => {
  console.error(err)
  process.exit(1)
})
