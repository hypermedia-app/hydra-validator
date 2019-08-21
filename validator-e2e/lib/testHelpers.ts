import { E2eContext } from '../types'
import { checkChain, IResult } from 'hydra-validator-core'

interface Summary {
    successes: number;
    failures: number;
    checkNames: string[];
}

export async function runAll (chain: checkChain<E2eContext>, context: E2eContext = { scenarios: [], basePath: '' }): Promise<IResult[] & Summary> {
    const checkNames = []

    let results: IResult[] = []
    let queue = [chain]

    while (queue.length > 0) {
        const check = queue.splice(0, 1)[0]
        checkNames.push(check.name)
        const checkOutcome = await check.call(context)

        let outcomeResults: IResult[] = []
        let outcomeNextChecks: checkChain<E2eContext>[] = []
        if (checkOutcome) {
            if (checkOutcome.result) {
                outcomeResults = [checkOutcome.result]
            } else {
                outcomeResults = checkOutcome.results || []
            }

            outcomeNextChecks = checkOutcome.nextChecks ? checkOutcome.nextChecks : []
        }

        results = [ ...results, ...outcomeResults ]
        queue = [ ...queue, ...outcomeNextChecks ]
    }

    const response = results as any

    response.successes = results.filter(r => r.status === 'success').length
    response.failures = results.filter(r => r.status === 'failure').length
    response.checkNames = checkNames

    return response
}
