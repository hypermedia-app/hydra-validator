import { E2eContext } from '../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { RuntimeStep } from './steps/factory'

interface Counts {
    total: number;
    visited: number;
}

function getCounts (counts: Counts, step: RuntimeStep) {
    counts.total += 1
    counts.visited += step.visited ? 1 : 0
    const children = step.children as RuntimeStep[]

    children.reduce(getCounts, counts)

    return counts
}

export function verifyAllScenariosExecuted (strict: boolean, steps: RuntimeStep[]): checkChain<E2eContext> {
    return function runStrictVerification (this: E2eContext): CheckResult<E2eContext> {
        const { visited, total } = steps.reduce(getCounts, {
            total: 0,
            visited: 0,
        })

        const summary = `Executed ${visited} out of ${total} steps.`

        if (strict && visited < total) {
            return {
                result: Result.Failure(summary, 'Strict mode requires that all steps are executed'),
            }
        }

        if (visited === 0) {
            return {
                result: Result.Failure(summary, 'At least one step should have been executed in non-strict mode'),
            }
        }

        if (visited < total) {
            return {
                result: Result.Warning(summary),
            }
        }

        return {
            result: Result.Informational(summary),
        }
    }
}
