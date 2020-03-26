# dnsdump

A CLI tool that dumps a bunch of DNS info for a domain.

## Install

`npm i dnsdump`

### For development

Make sure you have [Node 12.x](https://nodejs.org/download/release/v12.16.1/) or [nvm](https://github.com/nvm-sh/nvm) installed.

Clone the repo, `nvm i` (if you're using nvm), and `npm i`.

## Usage

```
$ dnsdump foobar.com

A:
  1.2.3.4
MX:
  exchange:
    abc.mail.com
  priority:
    10,
  exchange:
    bcd.mail.com
  priority:
    5
...
```

and specify DNS servers:

```
$ dnsdump foobar.com 8.8.8.8 8.8.4.4

...
```
