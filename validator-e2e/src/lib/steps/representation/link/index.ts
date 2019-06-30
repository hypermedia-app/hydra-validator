import { HydraResource, IHydraResource } from 'alcaeus/types/Resources'
import { Hydra } from 'alcaeus'
import { E2eContext } from '../../../../types'
import { checkChain, IResult, Result } from 'hydra-validator-core'
import processResponse from '../../../processResponse'
import { ScenarioStep } from '../../index'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { IResource } from 'alcaeus/types/Resources/Resource'

export class LinkStep extends ScenarioStep {
    public propertyId: string

    public constructor (propertyId: string, children: ScenarioStep[]) {
        super(children)

        this.propertyId = propertyId
    }

    protected appliesToInternal (obj: (IHydraResource & IResource) | IHydraResponse): boolean {
        return 'id' in obj
    }

    public getRunner (obj: (IHydraResource & IResource) | IHydraResponse) {
        const step = this
        const resource = obj as any as { [ prop: string ]: IHydraResource }

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
                nextChecks.push(processResponse(response, step.children))

                step.markExecuted()
            }

            return {
                result,
                nextChecks,
            }
        }
    }
}
