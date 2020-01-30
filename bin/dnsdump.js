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

const stringify = (x, level = 0) => {
  if (Array.isArray(x)) {
    return x.length ? x.map(y => stringify(y, level)).join(',\n') : ''
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
    throw new Error('Usage: [json=true] dnsdump <domain>')
  }

  const results = {}

  const promises = rrtypes.map(async rrtype => {
    let result = await resolve(domain, rrtype).catch(() => {})

    if (!result) return

    if (Array.isArray(result)) {
      result = result.flatMap(x => x).filter(Boolean)

      if (!result.length) return
    }

    results[rrtype] = result
  })

  await Promise.all(promises)

  const json = (process.env.json || '').trim()

  const str = json === 'true'
    ? JSON.stringify(results, null, 2)
    : stringify(results)

  console.log(str)
}
