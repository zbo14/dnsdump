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

module.exports = async (domain, ...servers) => {
  if (!domain) {
    throw new Error('Usage: [json=true] dnsdump <domain> [server1] [server2] ...')
  }

  const json = (process.env.json || '').trim().toLowerCase()
  const toString = json === 'true' ? JSON.stringify : stringify

  servers.length && dns.setServers(servers)

  const str = 'Querying DNS servers: ' +
    dns.getServers()
      .map(addr => `"${addr}"`)
      .join(', ')

  console.warn(str)

  const promises = rrtypes.map(async rrtype => {
    let result = await resolve(domain, rrtype).catch(() => {})

    if (!result) return

    if (Array.isArray(result)) {
      result = result.flatMap(x => x).filter(Boolean)

      if (!result.length) return
    }

    const str = toString({ [rrtype]: result })

    console.log(str)
  })

  await Promise.all(promises)

  console.warn('Done!')
}
