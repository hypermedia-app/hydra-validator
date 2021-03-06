import { Result } from 'hydra-validator-core'
import { ResponseStep } from '../index'

interface ExpectationStepInit {
  code: number
}

export class StatusStep extends ResponseStep {
  public code: number;

  public constructor(step: ExpectationStepInit) {
    super([])

    this.code = step.code
  }

  public getRunner(response: Response) {
    const expectation = this
    if (typeof expectation.code !== 'number' ||
            expectation.code < 100 ||
            expectation.code >= 600) {
      return () => ({
        result: Result.Error(
          'Step parameter is not a valid status code',
          'Status code must be an integer between 100 and 599'),
      })
    }

    return function () {
      const result = response.status === expectation.code
        ? Result.Success(`Status code '${expectation.code}'`)
        : Result.Failure(`Expected status code ${expectation.code} but got ${response.status}`)

      return { result }
    }
  }
}
