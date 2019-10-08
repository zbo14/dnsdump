# dnsdump
A CLI tool that dumps a bunch of DNS info for a domain.

## Install
`npm i dnsdump`

### For development
Make sure you have [nvm](https://github.com/nvm-sh/nvm) installed.

Clone the repo, `cd` into it, `nvm i`, and `npm i`.

## Usage
```
$ dnsdump foobar.com

A:
  1.2.3.4
MX:
  exchange:
    abc.mail.com
  priority:
    10
  exchange:
    bcd.mail.com
  priority:
    5
...
```
