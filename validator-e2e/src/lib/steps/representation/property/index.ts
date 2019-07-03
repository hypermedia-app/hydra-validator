import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { checkChain, IResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from '../../'

interface PropertyStepInit {
    propertyId: string;
}

export class PropertyStep extends ScenarioStep {
    public propertyId: string

    public constructor (init: PropertyStepInit, children: ScenarioStep[]) {
        super(children)

        this.propertyId = init.propertyId
    }

    protected appliesToInternal (obj: { [ prop: string ]: HydraResource }): boolean {
        return obj[this.propertyId] && 'id' in obj[this.propertyId]
    }

    public getRunner (resource: { [ prop: string ]: HydraResource }) {
        const step = this

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
