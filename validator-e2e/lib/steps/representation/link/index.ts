import { HydraResource } from 'alcaeus/types/Resources'
import { checkChain, Result } from 'hydra-validator-core'
import { getResponseRunner } from '../../../checkRunner'
import { ScenarioStep } from '../../index'
import { Constraint } from '../../constraints/Constraint'
import { E2eContext } from '../../../../types'

interface LinkStepInit {
    rel: string;
    strict: boolean;
}

export class LinkStep extends ScenarioStep<HydraResource> {
    private relation: string
    private strict: boolean

    public constructor (init: LinkStepInit, children: ScenarioStep[], constraints: Constraint[]) {
        super(children, constraints)

        this.relation = init.rel
        this.strict = init.strict
    }

    protected appliesToInternal (obj: HydraResource): boolean {
        return 'id' in obj
    }

    public getRunner (resource: HydraResource): checkChain<E2eContext> {
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

            const nextChecks = linkValue.resources.map(resource => getResponseRunner(resource.id, step))

            step.markExecuted()

            return {
                result: Result.Informational(`Stepping into link ${step.relation}`),
                nextChecks,
            }
        }
    }
}
