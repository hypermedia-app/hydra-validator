import fetch from 'node-fetch'
import * as program from 'commander'
import check from './checks/status-code'
import {Writer} from 'tsmonad';

program
    .command('analyze <url>')
    .action(function (url: string) {
        Promise.resolve()
            .then(async () => {
                const response = await fetch(url)

                const result = Writer.writer([], true)
                    .bind(x => check(response, x))
                    .caseOf({
                        writer: (story, value) => ({story, value})
                    })

                console.log(`${result.value}`)

                result.story.forEach(s => {
                    return console.log(s);
                })
            })
    })

program.parse(process.argv)
