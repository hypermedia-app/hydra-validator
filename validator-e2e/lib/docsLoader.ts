import { readFileSync, statSync } from 'fs'

export function load (docsPath: string) {
    const docsFileStats = statSync(docsPath)
    if (!docsFileStats.isFile()) {
        throw new Error()
    }

    return JSON.parse(readFileSync(docsPath).toString())
}
