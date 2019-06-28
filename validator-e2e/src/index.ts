import { checkChain, Result } from 'hydra-validator-core'
import { Hydra } from 'alcaeus'
import { join } from 'path'
import { E2eOptions, E2eContext, ApiTestScenarios } from './types'
import { factory as responseChecks } from './lib/responseChecks'
import { load } from './lib/docsLoader'

export function check (url: string, { docs, cwd }: E2eOptions): checkChain<E2eContext> {
    const docsPath = join(cwd, docs)
    let apiTestSettings: ApiTestScenarios

    try {
        apiTestSettings = load(docsPath)
    } catch (e) {
        return () => ({
            result: Result.Failure('Failed to load test scenarios', e),
        })
    }

    return async function tryFetch (this: E2eContext) {
        this.scenarios = apiTestSettings.steps

        const response = await Hydra.loadResource(url)

        return {
            result: Result.Informational(`Fetched representation of ${url}`),
            nextChecks: [
                responseChecks(response, []),
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
