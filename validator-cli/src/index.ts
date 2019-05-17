#!/usr/bin/env node

import * as program from 'commander'
import runChecks from './runChecks'
import urlResolvableCheck from './checks/url-resolvable'

program
    .command('analyze <url>')
    .action(function (url: string) {
        Promise.resolve()
            .then(async () => {
                const firstCheck = urlResolvableCheck(url)

                const checkGenerator = runChecks(firstCheck)

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
