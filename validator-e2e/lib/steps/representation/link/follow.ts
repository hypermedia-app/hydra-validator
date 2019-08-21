import { E2eContext } from '../../../../types'
import { Context, checkChain, IResult, Result } from 'hydra-validator-core'
import { getResourceRunner } from '../../../checkRunner'
import { ScenarioStep } from '../../'

interface FollowStepInit {
    variable: string;
}

export class FollowStep extends ScenarioStep {
    public variable: string

    public constructor (init: FollowStepInit, children: ScenarioStep[]) {
        super(children)

        this.variable = init.variable
    }

    public getRunner (obj: never, scope: Context) {
        const step = this
        return async function checkLink () {
            if (step.executed) {
                return {}
            }

            const resourceId = scope[step.variable]

            const result: IResult = resourceId
                ? Result.Informational(`Fetching resource ${resourceId}`)
                : Result.Failure(`Variable ${step.variable} not found`)

            let nextChecks: checkChain<E2eContext>[] = []
            if (result.status !== 'failure') {
                nextChecks.push(getResourceRunner(resourceId, step))

                step.markExecuted()
            }

            return {
                result,
                nextChecks,
            }
        }
    }

    protected appliesToInternal (): boolean {
        return true
    }
}
