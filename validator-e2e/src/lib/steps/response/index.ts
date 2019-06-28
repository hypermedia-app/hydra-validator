import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../../../types'
import { checkChain } from 'hydra-validator-core'
import representationChecks, { RepresentationStep } from '../representation'
import follow from '../representation/link/follow'
import expectationChecks, { ExpectationStep } from './expectation'
import { FollowStep, ScenarioStep } from '../'

export function factory (response: IHydraResponse, steps: ScenarioStep[]): checkChain<E2eContext> {
    const localScope = {}

    return function checkResponse (this: E2eContext) {
        const nextChecks: checkChain<E2eContext>[] = []

        steps.filter(step => step.type === 'Expectation')
            .reduce((checks, step) => {
                checks.push(expectationChecks(response, step as ExpectationStep, localScope))

                return checks
            }, nextChecks)

        steps.filter(step => step.type === 'Follow')
            .reduce((checks, step) => {
                checks.push(follow(step as any as FollowStep, localScope))

                return checks
            }, nextChecks)

        const resource = response.root
        if (resource) {
            const resourceSteps = this.scenarios.filter(step => step.type === 'Resource')
                .filter(step => step.children && step.children.length > 0) as RepresentationStep[]

            [...steps, ...resourceSteps].reduce((checks, step) => {
                if (resource.types.contains((step as any).id)) {
                    checks.push(representationChecks(resource, step.children || []))
                }

                return checks
            }, nextChecks)
        }

        return {
            nextChecks,
        }
    }
}
