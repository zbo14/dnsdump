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
  'SRV'
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
    throw new Error('Usage: dnsdump <domain> [server1] [server2] ...')
  }

  servers.length && dns.setServers(servers)

  const str = '[-] Querying DNS servers ' +
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

    if (rrtype === 'MX') {
      result = result
        .sort((a, b) => a.priority > b.priority ? 1 : -1)
        .map(({ exchange }) => exchange)
    }

    const str = stringify({ [rrtype]: result })

    console.log(str)
  })

  await Promise.all(promises)
}
