import { checkChain, Result } from 'hydra-validator-core'
import { join, dirname } from 'path'
import { E2eOptions, E2eContext } from './types'
import { getUrlRunner } from './lib/checkRunner'
import { load, ScenarioJson } from './lib/docsLoader'
import createSteps, { RuntimeStep } from './lib/steps/factory'
import { verifyAllScenariosExecuted } from './lib/strictRunVerification'
import { buildHeaders } from './lib/headers'

export function check (url: string, { docs, cwd, strict }: E2eOptions): checkChain<E2eContext> {
    const docsPath = join(cwd, docs)
    let steps: RuntimeStep[]
    let resourcePath: string
    let scenario: ScenarioJson

    try {
        scenario = load(docsPath)
        steps = createSteps(scenario.steps)
        resourcePath = scenario.entrypoint || ''
    } catch (e) {
        return () => ({
            result: Result.Failure('Failed to load test scenarios', e),
        })
    }

    return async function tryFetch (this: E2eContext) {
        this.scenarios = steps
        this.basePath = dirname(docsPath)
        if (scenario.defaultHeaders) {
            this.headers = buildHeaders.call(this, scenario.defaultHeaders)
        }

        return {
            nextChecks: [
                getUrlRunner(url + resourcePath),
                verifyAllScenariosExecuted(strict, steps),
            ],
            sameLevel: true,
        }
    }
}

export const options = [
    {
        flags: '-d, --docs <docsPath>',
        description: 'path to JSON containing test scenarios',
    },
    {
        flags: '--strict',
        description: 'Fail if not all steps are executed',
        defaultValue: false,
    },
]
