import { HydraResource } from 'alcaeus/types/Resources'
import { Hydra } from 'alcaeus'
import { PropertyStep, E2eContext } from '../../../../types'
import { checkChain, IResult, Result } from 'hydra-validator-core'
import { factory as responseChecks } from '../../response'

export default function index (resource: HydraResource & any, step: PropertyStep): checkChain<E2eContext> {
    return async function checkLink () {
        if (step.executed) {
            return {}
        }

        const result: IResult = resource[step.propertyId]
            ? Result.Informational(`Stepping into link ${step.propertyId}`)
            : Result.Failure(`Link ${step.propertyId} missing on resource ${resource.id}`)

        let nextChecks: checkChain<E2eContext>[] = []
        if (result.status !== 'failure') {
            const linkedResource = resource[step.propertyId] as HydraResource
            const response = await Hydra.loadResource(linkedResource.id)
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
