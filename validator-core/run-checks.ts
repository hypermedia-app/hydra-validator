import { checkChain, Context, Result } from '.'

function wrapCheck (check: checkChain, level: number) {
    return async function (ctx: Context) {
        const { result, results, nextChecks, sameLevel } = await check.call(ctx)

        const outResults = []
        if (result) {
            outResults.push(result)
        }
        if (Array.isArray(results)) {
            outResults.push(...results)
        }

        return {
            level,
            results: outResults,
            nextChecks: nextChecks || [],
            bumpLevel: !sameLevel,
        }
    }
}

async function * runChecks (firstCheck: checkChain, fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {
    const summary = {
        successes: 0,
        warnings: 0,
        failures: 0,
    }
    const context = {
        visitedUrls: [],
        fetch,
    }
    const checkQueue = [ wrapCheck(firstCheck, 0) ]

    yield {
        level: 0,
        result: Result.Informational('Analysis started...'),
    }

    let previousLevel = 0
    while (checkQueue.length > 0) {
        const currentCheck = checkQueue.splice(0, 1)[0]
        const { results, nextChecks, level, bumpLevel } = await currentCheck(context)
            .catch(reason => ({
                results: [ Result.Error('Unhandled error occurred in check', reason) ],
                nextChecks: [] as checkChain<Context>[],
                level: previousLevel,
                bumpLevel: false,
            }))
        previousLevel = level

        for (let result of results) {
            switch (result.status) {
                case 'success':
                    summary.successes++
                    break
                case 'failure':
                    summary.failures++
                    break
                case 'warning':
                    summary.warnings++
                    break
            }

            yield {
                result,
                level,
            }
        }

        const wrapped = nextChecks.map(check => {
            let nextLevel = level
            if (results.length > 0 && bumpLevel) {
                nextLevel += 1
            }

            return wrapCheck(check, nextLevel)
        })

        checkQueue.unshift(...wrapped)
    }

    let details = `Success: ${summary.successes}`
    let summaryResult = Result.Success('Analysis complete', details)

    if (summary.warnings > 0) {
        details = `${details}, Warnings: ${summary.warnings}`
        summaryResult = Result.Warning('Analysis complete with warnings', details)
    }

    if (summary.failures > 0) {
        details = `${details}, Failures: ${summary.failures}`
        summaryResult = Result.Failure('Analysis complete with errors', details)
    }

    yield {
        level: 0,
        result: summaryResult,
    }
}

export default runChecks
