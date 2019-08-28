import { HydraResource } from 'alcaeus/types/Resources'
import { checkChain, Result } from 'hydra-validator-core'
import { getResponseRunner } from '../../../checkRunner'
import { ScenarioStep } from '../../index'
import { Constraint } from '../../constraints/Constraint'
import { E2eContext } from '../../../../types'
import { IResource } from 'alcaeus/types/Resources/Resource'

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

            // found supportedProperty which is a hydra:Link
            if (linkValue) {
                return {
                    result: Result.Informational(`Stepping into link ${step.relation}`),
                    nextChecks: linkValue.resources.map(resource => getResponseRunner(resource.id, step)),
                }
            }

            // the resource may have a matching key, but not a supportedProperty hydra:Links
            if (step.relation in resource) {
                const potentialLinks = resource.getArray(step.relation)
                    .filter((r: any) => typeof r === 'object' && 'id' in r) as IResource[]

                if (potentialLinks.length > 0) {
                    return {
                        result: Result.Warning(
                            `Stepping into link ${step.relation}`,
                            `Resources found but ${step.relation} is not a SupportedProperty of hydra:Link type.`),
                        nextChecks: potentialLinks.map(resource => getResponseRunner(resource.id, step)),
                    }
                }
            }

            if (step.strict) {
                return {
                    result: Result.Failure(`No resources found on resource ${resource.id} linked with ${step.relation}`),
                }
            }

            return {}
        }
    }
}
