import { checkChain, Context, Result } from './check'

function wrapCheck (check: checkChain, ctx: Context, level: number) {
    return async function () {
        const { result, results, context, nextChecks, sameLevel } = await check.call(ctx)

        const nextContext = context ? { ...ctx, ...context } : ctx

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
            context: nextContext,
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
    const checkQueue = [ wrapCheck(firstCheck, context, 0) ]

    yield {
        level: 0,
        result: Result.Informational('Analysis started...'),
    }

    while (checkQueue.length > 0) {
        const currentCheck = checkQueue.splice(0, 1)[0]
        const { results, context, nextChecks, level, bumpLevel } = await currentCheck()

        for (let result of results) {
            yield {
                result,
                level: level,
            }
        }

        const wrapped = nextChecks.map(check => {
            let nextLevel = level
            if (results.length > 0 && bumpLevel) {
                nextLevel += 1
            }

            return wrapCheck(check, context, nextLevel)
        })

        checkQueue.unshift(...wrapped)
    }
}

export default runChecks
