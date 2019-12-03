import { readFileSync, statSync } from 'fs'

interface ScenarioJson {
    entrypoint?: string;
    steps: unknown[];
}

export function load (docsPath: string): ScenarioJson {
    const docsFileStats = statSync(docsPath)
    if (!docsFileStats.isFile()) {
        throw new Error()
    }

    return JSON.parse(readFileSync(docsPath).toString())
}
