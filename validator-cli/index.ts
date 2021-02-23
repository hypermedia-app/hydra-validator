#!/usr/bin/env node

import program from 'commander'
import runChecks from 'hydra-validator-core/run-checks'
import deps from 'matchdep'
import debug, { Debugger } from 'debug'
import { ResultKind } from 'hydra-validator-core'

export type Loggers = Record<string, Debugger>
const loggers: Loggers = {
  success: debug('SUCCESS'),
  informational: debug('INFO'),
  warning: debug('WARNING'),
  failure: debug('FAILURE'),
  error: debug('ERROR'),
}

debug.enable('*')

debug.formatters.p = (level) => {
  return level === 0 ? '' : ` ${'-'.repeat(level * 2)}`
}

debug.formatters.l = (logger: ResultKind) => {
  if (logger === 'informational') {
    return '   '
  }

  if (logger === 'error') {
    return '  '
  }

  return ''
}

const plugins = deps.filterAll(['hydra-validator-*', 'hydra-validator-core'], `${process.cwd()}/package.json`)

for (const plugin of plugins) {
  const match = plugin.match(/^hydra-validator-([\d\w]+)$/)
  if (!match) {
    continue
  }

  const commandName = match[1]
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { check, options } = require(plugin)

  const command = program
    .command(`${commandName} <url>`)

  if (options && Array.isArray(options)) {
    for (const option of options) {
      command.option(option.flags, option.description, option.defaultValue)
    }
  }

  command.action(function (this: any, url: string) {
    Promise.resolve()
      .then(async () => {
        let unsucessfulCount = 0
        const firstCheck = check(url, { ...this, cwd: process.cwd(), log: loggers })

        const checkGenerator = runChecks(firstCheck)

        for await (const check of checkGenerator) {
          loggers[check.result.status]('%l %p %s %s', check.result.status, check.level, check.result.description, (check.result as any).details || '')

          if (check.result.status === 'failure' || check.result.status === 'error') {
            unsucessfulCount++
          }
        }

        process.exit(unsucessfulCount)
      })
  })
}

program.parse(process.argv)
