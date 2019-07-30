import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from './steps'

function processResponse (response: IHydraResponse, steps: ScenarioStep[], topLevelSteps: ScenarioStep[]): CheckResult<E2eContext> {
    const localContext = {}

    const nextChecks: checkChain<E2eContext>[] = []
    const resource = response.root
    const xhr = response.xhr

    const results = [
        Result.Informational(`Fetched resource ${xhr.url}`),
    ]
    if (!resource) {
        results.push(Result.Warning('Could not determine the resource representation'))
    }

    for (let step of [...steps, ...topLevelSteps]) {
        if (step.appliesTo(xhr)) {
            nextChecks.push(step.getRunner(xhr, localContext))
        } else if (step.appliesTo(resource)) {
            nextChecks.push(step.getRunner(resource, localContext))
        }
    }

    return {
        results,
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
