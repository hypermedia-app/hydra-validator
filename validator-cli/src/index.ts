#!/usr/bin/env node

import * as program from 'commander'
import runChecks from 'hydra-validator-core/dist/run-checks'
// @ts-ignore
import * as fetch from 'nodeify-fetch'
// @ts-ignore
import * as deps from 'matchdep'

const plugins: string[] = deps.filterAll([ 'hydra-validator-*', 'hydra-validator-core' ])

for (let plugin of plugins) {
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
        for (let option of options) {
            command.option(option.flags)
        }
    }

    command.action(function (this: object, url: string) {
        const commandParams = this

        Promise.resolve()
            .then(async () => {
                const firstCheck = check(url, commandParams)

                const checkGenerator = runChecks(firstCheck, fetch)

                for await (let check of checkGenerator) {
                    const prefix = check.level === 0 ? '' : `${'-'.repeat(check.level * 2)} `

                    if (check.result.status === 'success') {
                        console.log(`${prefix}${check.result.description}`)
                    } else if (check.result.status === 'informational') {
                        console.warn(`${prefix}${check.result.description}`)
                    } else {
                        // @ts-ignore
                        console.error(`${prefix}${check.result.description} ${check.result.details || ''}`)
                    }
                }
            })
    })
}

program.parse(process.argv)
