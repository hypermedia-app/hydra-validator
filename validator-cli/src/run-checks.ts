import { checkChain, Context, Result } from './check'

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
    let context = {
        visitedUrls: [],
        fetch,
    }
    const checkQueue = [ wrapCheck(firstCheck, 0) ]

    yield {
        level: 0,
        result: Result.Informational('Analysis started...'),
    }

    while (checkQueue.length > 0) {
        const currentCheck = checkQueue.splice(0, 1)[0]
        const { results, nextChecks, level, bumpLevel } = await currentCheck(context)

        for (let result of results) {
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

    yield {
        level: 0,
        result: Result.Informational('Analysis complete.'),
    }
}

export default runChecks
