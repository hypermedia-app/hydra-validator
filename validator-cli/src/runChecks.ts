import { checkChain, Context, Result } from './check'

function wrapCheck (check: checkChain, ctx: Context, level: number) {
    return async function () {
        const { result, results, context, nextChecks } = await check.call(ctx)

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
            nextChecks: nextChecks || []
        }
    }
}

async function * runChecks (firstCheck: checkChain) {
    let context = {}
    const checkQueue = [ wrapCheck(firstCheck, context, 0) ]

    yield {
        level: 0,
        result: Result.Informational('Analysis started...')
    }

    while (checkQueue.length > 0) {
        const currentCheck = checkQueue.splice(0, 1)[0]
        const { results, context, nextChecks, level } = await currentCheck()

        for (let result of results) {
            yield {
                result,
                level: level
            }
        }

        const wrapped = nextChecks.map(check => {
            return wrapCheck(check, context, level + 1)
        })

        checkQueue.unshift(...wrapped)
    }
}

export default runChecks
