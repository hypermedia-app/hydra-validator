import * as program from 'commander'
import runChecks from './runChecks'

program
    .command('analyze <url>')
    .action(function (url: string) {
        Promise.resolve()
            .then(async () => {
                const checkGenerator = runChecks(url)

                for await (let check of checkGenerator) {
                    console.log(`${check.description} ${check.success}`)
                }
            })
    })

program.parse(process.argv)
