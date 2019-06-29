import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../../../types'
import { checkChain } from 'hydra-validator-core'
import { ScenarioStep } from '../'

export function factory (response: IHydraResponse, steps: ScenarioStep[]): checkChain<E2eContext> {
    const localContext = {}

    return function checkResponse (this: E2eContext) {
        const nextChecks: checkChain<E2eContext>[] = []
        const resource = response.root

        for (let step of [...steps, ...this.scenarios]) {
            if (step.appliesTo(response)) {
                nextChecks.push(step.getRunner(response, localContext))
            } else if (step.appliesTo(resource)) {
                nextChecks.push(step.getRunner(resource, localContext))
            }
        }

        return {
            nextChecks,
        }
    }
}
