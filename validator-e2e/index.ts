import { checkChain, Result } from 'hydra-validator-core'
import { join, dirname } from 'path'
import { E2eOptions, E2eContext } from './types'
import { getUrlRunner } from './lib/checkRunner'
import { load } from './lib/docsLoader'
import createSteps, { RuntimeStep } from './lib/steps/factory'
import { verifyAllScenariosExecuted } from './lib/strictRunVerification'

export function check (url: string, { docs, cwd, strict }: E2eOptions): checkChain<E2eContext> {
    const docsPath = join(cwd, docs)
    let steps: RuntimeStep[]
    let resourcePath: string

    try {
        const scenario = load(docsPath)
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
