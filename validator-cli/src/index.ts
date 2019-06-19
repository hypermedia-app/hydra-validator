#!/usr/bin/env node

import * as program from 'commander'
import runChecks from 'hydra-validator-core/dist/run-checks'
// @ts-ignore
import * as fetch from 'nodeify-fetch'

program
    .arguments('<cmd> <url>')
    .action(function (cmd: string, url: string) {
        Promise.resolve()
            .then(async () => {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { check } = require(`hydra-validator-${cmd}`)
                const firstCheck = check(url)

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

program.parse(process.argv)
