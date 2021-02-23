import { E2eContext } from '../../../../types'
import { Context, checkChain, IResult, Result } from 'hydra-validator-core'
import { getUrlRunner } from '../../../checkRunner'
import { ScenarioStep } from '../../index'

interface FollowStepInit {
  variable: string
}

export class FollowStep extends ScenarioStep {
  public variable: string

  public constructor(init: FollowStepInit, children: ScenarioStep[]) {
    super(children)

    this.variable = init.variable
  }

  public getRunner(obj: unknown, scope: Context) {
    const step = this
    return async function checkLink() {
      if (step.executed) {
        return {}
      }

      const resourceId: string | unknown = scope[step.variable]

      if (typeof resourceId !== 'string') {
        return {
          result: Result.Error(`Cannot fetch resource. Value of variable ${step.variable} must be a string`),
        }
      }

      const result: IResult = resourceId
        ? Result.Informational(`Fetching resource ${resourceId}`)
        : Result.Failure(`Variable ${step.variable} not found`)

      const nextChecks: checkChain<E2eContext>[] = []
      if (result.status !== 'failure') {
        nextChecks.push(getUrlRunner(resourceId, step))

        step.markExecuted()
      }

      return {
        result,
        nextChecks,
      }
    }
  }

  protected appliesToInternal(): boolean {
    return true
  }
}
