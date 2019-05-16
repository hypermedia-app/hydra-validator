import {checkChain, Context, Result} from './check';

function wrapCheck(check: checkChain, ctx: Context) {
    return async function () {
        const {messages, context, nextChecks} = await check.call(ctx)

        return {
            messages,
            context: context || ctx,
            nextChecks
        }
    }
}

async function* runChecks(firstCheck: checkChain) {
    const checkQueue = [ wrapCheck(firstCheck, { level: 0 }) ]

    yield {
        level: 0,
        message: Result.Informational('Analysis started...')
    }

    while (checkQueue.length > 0) {
        const currentCheck = checkQueue.splice(0, 1)[0]
        const {messages, context, nextChecks} = await currentCheck()

        const messagesArray = Array.isArray(messages) ? messages : [messages]
        for (let message of messagesArray) {
            yield {
                message,
                level: context.level
            }
        }

        if (nextChecks && nextChecks.length > 0) {
            const wrapped = nextChecks.map(check => {
                const newCtx = {
                    ...context,
                    level: context.level + 1
                }
                return wrapCheck(check, newCtx)
            })

            checkQueue.unshift(...wrapped)
        }
    }
}

export default runChecks
