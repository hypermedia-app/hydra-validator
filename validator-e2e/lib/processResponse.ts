import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../types'
import { checkChain, Result } from 'hydra-validator-core'
import { ScenarioStep } from './steps'

function processResponse (response: IHydraResponse, steps: ScenarioStep[], topLevelSteps: ScenarioStep[]) {
    const localContext = {}

    const nextChecks: checkChain<E2eContext>[] = []
    const resource = response.root
    const xhr = response.xhr

    for (let step of [...steps, ...topLevelSteps]) {
        if (step.appliesTo(xhr)) {
            nextChecks.push(step.getRunner(xhr, localContext))
        } else if (step.appliesTo(resource)) {
            nextChecks.push(step.getRunner(resource, localContext))
        }
    }

    return {
        result: Result.Informational(`Fetched resource ${xhr.url}`),
        nextChecks,
        sameLevel: true,
    }
}

export function getResponseRunner (response: IHydraResponse, steps: ScenarioStep[]) {
    return function checkResponse (this: E2eContext) {
        return processResponse(response, steps, this.scenarios)
    }
}

export function getResourceRunner (resourceId: string, steps: ScenarioStep[]) {
    return async function checkResourceResponse (this: E2eContext) {
        const response = await Hydra.loadResource(resourceId)
        return processResponse(response, steps, this.scenarios)
    }
}
