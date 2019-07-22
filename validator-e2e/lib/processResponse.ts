import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../types'
import { checkChain } from 'hydra-validator-core'
import { ScenarioStep } from './steps'

export default function (response: IHydraResponse, steps: ScenarioStep[]): checkChain<E2eContext> {
    const localContext = {}

    return function checkResponse (this: E2eContext) {
        const nextChecks: checkChain<E2eContext>[] = []
        const resource = response.root
        const xhr = response.xhr

        for (let step of [...steps, ...this.scenarios]) {
            if (step.appliesTo(xhr)) {
                nextChecks.push(step.getRunner(xhr, localContext))
            } else if (step.appliesTo(resource)) {
                nextChecks.push(step.getRunner(resource, localContext))
            }
        }

        return {
            nextChecks,
        }
    }
}
