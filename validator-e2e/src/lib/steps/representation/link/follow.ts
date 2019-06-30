import { Hydra } from 'alcaeus'
import { E2eContext } from '../../../../types'
import { Context, checkChain, IResult, Result } from 'hydra-validator-core'
import processResponse from '../../../processResponse'
import { ScenarioStep } from '../../'

export class FollowStep extends ScenarioStep {
    public variable: string

    public constructor (variable: string, children: ScenarioStep[]) {
        super(children)

        this.variable = variable
    }

    protected appliesToInternal (): boolean {
        return true
    }

    public getRunner (obj: never, scope: Context) {
        const step = this
        return async function checkLink () {
            if (step.executed) {
                return {}
            }

            const resourceId = scope[step.variable]

            const result: IResult = resourceId
                ? Result.Informational(`Stepping into resource ${resourceId}`)
                : Result.Failure(`Variable ${step.variable} not found`)

            let nextChecks: checkChain<E2eContext>[] = []
            if (result.status !== 'failure') {
                const response = await Hydra.loadResource(resourceId)
                nextChecks.push(processResponse(response, step.children || []))

                step.markExecuted()
            }

            return {
                result,
                nextChecks,
            }
        }
    }
}
