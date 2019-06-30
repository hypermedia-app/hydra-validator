import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { checkChain, IResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from '../../'
import { IResource } from 'alcaeus/types/Resources/Resource'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'

interface PropertyStepInit {
    propertyId: string;
}

export class PropertyStep extends ScenarioStep {
    public propertyId: string

    public constructor (init: PropertyStepInit, children: ScenarioStep[]) {
        super(children)

        this.propertyId = init.propertyId
    }

    protected appliesToInternal (obj: (HydraResource & IResource) | IHydraResponse): boolean {
        return 'id' in obj
    }

    public getRunner (obj: HydraResource) {
        const step = this
        const resource = obj as any as { [ prop: string ]: HydraResource }

        return function () {
            if (step.executed) {
                return {}
            }

            const result: IResult = resource[step.propertyId]
                ? Result.Informational(`Stepping into property ${step.propertyId}`)
                : Result.Failure(`Property ${step.propertyId} missing on resource ${resource.id}`)

            let nextChecks: checkChain<E2eContext>[] = []
            if (result.status !== 'failure') {
                step.children.reduce((checks, child) => {
                    if (child.appliesTo(resource[step.propertyId])) {
                        checks.push(child.getRunner(resource[step.propertyId]))
                    }
                    return checks
                }, nextChecks)
                step.markExecuted()
            }

            return {
                result,
                nextChecks,
            }
        }
    }
}
