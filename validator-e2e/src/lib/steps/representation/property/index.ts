import { HydraResource } from 'alcaeus/types/Resources'
import { PropertyStep, E2eContext } from '../../../../types'
import { checkChain, IResult, Result } from 'hydra-validator-core'
import representationChecks from '../'

export default function (resource: HydraResource & any, step: PropertyStep): checkChain<E2eContext> {
    return function () {
        if (step.executed) {
            return {}
        }

        const result: IResult = resource[step.propertyId]
            ? Result.Informational(`Stepping into property ${step.propertyId}`)
            : Result.Failure(`Property ${step.propertyId} missing on resource ${resource.id}`)

        let nextChecks: checkChain<E2eContext>[] = []
        if (step.children && result.status !== 'failure') {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            nextChecks.push(representationChecks(resource[step.propertyId] as HydraResource, step.children))

            step.executed = true
        }

        return {
            result,
            nextChecks,
        }
    }
}
