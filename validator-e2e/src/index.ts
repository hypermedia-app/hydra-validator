import { checkChain, Result } from 'hydra-validator-core'
import { Hydra } from 'alcaeus'
import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import { E2eOptions, E2eContext, ApiTestScenarios } from './types'
import responseChecks from './lib/responseChecks'

export function check (url: string, { docs, cwd }: E2eOptions): checkChain<E2eContext> {
    const docsPath = join(cwd, docs)

    const docsFileStats = statSync(docsPath)
    if (!docsFileStats.isFile()) {
        throw new Error()
    }

    return async function tryFetch (this: E2eContext) {
        const apiTestSettings: ApiTestScenarios = JSON.parse((await readFileSync(docsPath)).toString())
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
