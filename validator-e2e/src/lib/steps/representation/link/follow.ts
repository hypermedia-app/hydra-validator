import { Hydra } from 'alcaeus'
import { FollowStep, E2eContext } from '../../../../types'
import { Context, checkChain, IResult, Result } from 'hydra-validator-core'
import { factory as responseChecks } from '../../response'

export default function (step: FollowStep, scope: Context): checkChain<E2eContext> {
    return async function checkLink () {
        if (step.executed) {
            return {}
        }

        const resourceId = scope[step.resourceId]

        const result: IResult = resourceId
            ? Result.Informational(`Stepping into resource ${resourceId}`)
            : Result.Failure(`Variable ${step.resourceId} not found`)

        let nextChecks: checkChain<E2eContext>[] = []
        if (result.status !== 'failure') {
            const response = await Hydra.loadResource(resourceId)
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            nextChecks.push(responseChecks(response, step.children || []))

            step.executed = true
        }

        return {
            result,
            nextChecks,
        }
    }
}
