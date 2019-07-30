import { HydraResource } from 'alcaeus/types/Resources'
import { Result } from 'hydra-validator-core'
import { getResourceRunner } from '../../../processResponse'
import { ScenarioStep } from '../../index'

interface LinkStepInit {
    rel: string;
    strict: boolean;
}

export class LinkStep extends ScenarioStep {
    private relation: string
    private strict: boolean

    public constructor (init: LinkStepInit, children: ScenarioStep[]) {
        super(children)

        this.relation = init.rel
        this.strict = init.strict
    }

    protected appliesToInternal (obj: any): boolean {
        return 'id' in obj
    }

    public getRunner (resource: HydraResource) {
        const step = this

        return async function checkLink () {
            if (step.executed) {
                return {}
            }

            const linkValue = resource.getLinks()
                .find(link => link.supportedProperty.property.id === step.relation)

            if (!linkValue) {
                if (step.strict) {
                    return {
                        result: Result.Failure(`Link ${step.relation} missing on resource ${resource.id}`),
                    }
                }

                return {}
            }

            const nextChecks = linkValue.resources.map(resource => getResourceRunner(resource.id, step.children))

            step.markExecuted()

            return {
                result: Result.Informational(`Stepping into link ${step.relation}`),
                nextChecks,
            }
        }
    }
}
