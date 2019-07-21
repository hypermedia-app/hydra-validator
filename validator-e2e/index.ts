import { checkChain, Result } from 'hydra-validator-core'
import { Hydra } from 'alcaeus'
import { join } from 'path'
import { E2eOptions, E2eContext } from './types'
import processResponse from './lib/processResponse'
import { load } from './lib/docsLoader'
import createSteps from './lib/steps/factory'
import { ScenarioStep } from './lib/steps'

export function check (url: string, { docs, cwd }: E2eOptions): checkChain<E2eContext> {
    const docsPath = join(cwd, docs)
    let apiTestSettings: ScenarioStep[]

    try {
        apiTestSettings = createSteps(load(docsPath))
    } catch (e) {
        return () => ({
            result: Result.Failure('Failed to load test scenarios', e),
        })
    }

    return async function tryFetch (this: E2eContext) {
        this.scenarios = apiTestSettings

        const response = await Hydra.loadResource(url)

        return {
            result: Result.Informational(`Fetched representation of ${url}`),
            nextChecks: [
                processResponse(response, []),
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
]
