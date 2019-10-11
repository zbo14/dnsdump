'use strict'

const dns = require('dns')
const { promisify } = require('util')
const resolve = promisify(dns.resolve)

const rrtypes = [
  'A',
  'AAAA',
  'CNAME',
  'MX',
  'NAPTR',
  'NS',
  'PTR',
  'SOA',
  'SRV',
  'TXT'
]

const flatten = arr => {
  if (arr.length === 1) {
    return Array.isArray(arr[0]) ? flatten(arr[0]) : arr[0]
  }

  if (Array.isArray(arr[0])) {
    return arr.reduce((arr, subarr) => [...arr, ...subarr], [])
  }

  return arr
}

const stringify = (x, level = 0) => {
  if (Array.isArray(x)) {
    return x.length ? x.map(y => stringify(y, level)).join('\n') : ''
  }

  if (x.constructor.name === 'Object') {
    return Object.entries(x)
      .map(([key, value]) => '  '.repeat(level) + key + ':\n' + stringify(value, level + 1))
      .join('\n')
  }

  return '  '.repeat(level) + x
}

module.exports = async domain => {
  if (!domain) {
    throw new Error('Usage: dnsdump DOMAIN')
  }

  const promises = rrtypes.map(rrtype => {
    return resolve(domain, rrtype)
      .then(result => ({ [rrtype]: flatten(result) }))
      .catch(() => {})
  })

  const arr = await Promise.all(promises)
  const result = {}

  arr.forEach(record => {
    if (!record) return

    const keys = Object.keys(record)
    const value = record[keys[0]]

    if (keys.length === 1 && Array.isArray(value) && !value.length) return

    Object.assign(result, record)
  })

  console.log(stringify(result))
}
