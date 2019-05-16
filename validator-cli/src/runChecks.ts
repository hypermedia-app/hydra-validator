import {checkChain, Context, Result} from './check';

function wrapCheck(check: checkChain, ctx: Context, level: number) {
    return async function () {
        const {message, messages, context, nextChecks} = await check.call(ctx)

        const nextContext = context ? { ...ctx, ...context } : ctx

        const outMessages = []
        if (message) {
            outMessages.push(message)
        }
        if (Array.isArray(messages)) {
           outMessages.push(...messages)
        }

        return {
            level,
            messages: outMessages,
            context: nextContext,
            nextChecks: nextChecks || []
        }
    }
}

async function* runChecks(firstCheck: checkChain) {
    let context = {}
    const checkQueue = [ wrapCheck(firstCheck, context, 0) ]

    yield {
        level: 0,
        message: Result.Informational('Analysis started...')
    }

    while (checkQueue.length > 0) {
        const currentCheck = checkQueue.splice(0, 1)[0]
        const {messages, context, nextChecks, level} = await currentCheck()

        for (let message of messages) {
            yield {
                message,
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
