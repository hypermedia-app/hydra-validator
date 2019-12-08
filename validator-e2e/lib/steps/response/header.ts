import { IResult, Result, Context } from 'hydra-validator-core'
import { ResponseStep } from '../'
import escapeStringRegexp from 'escape-string-regexp'

interface ExpectationStepInit {
  header: string
  captureAs?: string
  value?: string
  pattern?: string
}

export class HeaderStep extends ResponseStep {
  public header: string;
  public captureAs: string | null;
  public pattern: string | null;

  public constructor(step: ExpectationStepInit) {
    super([])

    this.header = step.header
    this.captureAs = step.captureAs || null
    this.pattern = step.pattern || null
    if (step.value) {
      this.pattern = `^${escapeStringRegexp(step.value)}$`
    }
  }

  public getRunner(response: Response, scope: Context) {
    const expectation = this
    let regex: RegExp

    try {
      if (expectation.pattern) {
        regex = new RegExp(expectation.pattern)
      }
    } catch (e) {
      return () => ({ result: Result.Error('Regular expression is not valid', e) })
    }

    return function () {
      let result: IResult

      if (!response.headers.has(expectation.header)) {
        return {
          result: Result.Failure(`Expected to find response header ${expectation.header}`),
        }
      }
      result = Result.Success(`Found '${expectation.header}' header`)

      if (expectation.captureAs) {
        scope[expectation.captureAs] = response.headers.get(expectation.header)
      }

      if (regex) {
        const value = response.headers.get(expectation.header)
        if (!value || !regex.test(value)) {
          result = Result.Failure(`Expected header ${expectation.header} to match ${regex} but found '${response.headers.get(expectation.header)}'`)
        }
      }

      return { result }
    }
  }
}
