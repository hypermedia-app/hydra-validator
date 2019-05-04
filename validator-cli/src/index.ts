import fetch from 'node-fetch'
import * as program from 'commander'
import check from './checks/status-code'
import {Writer, Maybe} from 'tsmonad'
import {Result} from './checks/check'

program
    .command('analyze <url>')
    .action(function (url: string) {
        Promise.resolve()
            .then(async () => {
                const response = Maybe.just(await fetch(url))
                let result = Writer.writer<Result, boolean>([], true)

                result = result.bind(current => {
                    return check(response)
                        .caseOf({
                            right: r => Writer.writer([r], false),
                            left: l => l.caseOf({
                                right: r => Writer.writer([r], false),
                                left: l1 => Writer.writer<Result, boolean>([l1], current && true)
                            })
                        })
                })

                const report = result.caseOf({
                        writer: (story, value) => ({story, value})
                    })

                console.log(`${report.value}`)

                report.story.forEach(test => {
                    return console.log(`${test.name} was ${test.success ? 'successful' : 'unsuccessful'}`)
                })
            })
    })

program.parse(process.argv)
