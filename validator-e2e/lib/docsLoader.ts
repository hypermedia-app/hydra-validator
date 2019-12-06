import { readFileSync, statSync } from 'fs'

export interface ScenarioJson {
    entrypoint?: string;
    defaultHeaders?: Record<string, string[]>;
    steps: unknown[];
}

export function load (docsPath: string): ScenarioJson {
    const docsFileStats = statSync(docsPath)
    if (!docsFileStats.isFile()) {
        throw new Error()
    }

    return JSON.parse(readFileSync(docsPath).toString())
}
