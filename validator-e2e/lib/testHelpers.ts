import { E2eContext } from '../types'
import { checkChain, IResult } from 'hydra-validator-core'

interface Summary {
    successes: number;
    failures: number;
}

export async function runAll (chain: checkChain<E2eContext>): Promise<IResult[] & Summary> {
    const context: E2eContext & any = {}

    let results: IResult[] = []
    let queue = [chain]

    while (queue.length > 0) {
        const check = queue.splice(0, 1)[0]
        const checkOutcome = await check.call(context)

        const outcomeResults = checkOutcome.result ? [ checkOutcome.result ] : checkOutcome.results || []
        const outcomeNextChecks = checkOutcome.nextChecks ? checkOutcome.nextChecks : []

        results = [ ...results, ...outcomeResults ]
        queue = [ ...queue, ...outcomeNextChecks ]
    }

    const response = results as any

    response.successes = results.filter(r => r.status === 'success').length
    response.failures = results.filter(r => r.status === 'failure').length

    return response
}
