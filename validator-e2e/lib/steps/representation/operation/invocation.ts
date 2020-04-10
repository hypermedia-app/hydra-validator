import { Operation } from 'alcaeus/Resources/Operation'
import { E2eContext } from '../../../../types'
import { checkChain, Result } from 'hydra-validator-core'
import { getResponseRunner } from '../../../checkRunner'
import { ScenarioStep } from '../../index'
import { readFileSync } from '../../fs'
import { resolve } from 'path'

interface InvocationStepInit {
  body?: string | { path: string }
  headers?: { [key: string]: string }
}

export class InvocationStep extends ScenarioStep {
  private body?: (basePath: string) => BodyInit;
  private headers: Map<string, string>;

  public constructor(init: InvocationStepInit, children: ScenarioStep[]) {
    super(children)

    this.headers = Object.entries((init.headers || {}))
      .reduce((headers, kv) => {
        headers.set(kv[0].toLowerCase(), kv[1])
        return headers
      }, new Map())

    if (typeof init.body === 'string') {
      const body = init.body
      this.body = () => body
    } else if (init.body && init.body.path) {
      const path = init.body.path
      this.body = (basePath) => readFileSync(resolve(basePath, path))
    }
  }

  public getRunner(operation: Operation): checkChain<E2eContext> {
    const step = this
    return async function (this: E2eContext) {
      if (step.executed) {
        return {}
      }

      let body: BodyInit = ''
      if (step.body) {
        try {
          body = await step.body(this.basePath)
        } catch (e) {
          return {
            result: Result.Error('Failed to load body', e),
          }
        }
      }
      const headers = [...step.headers.entries()].reduce((headers, [header, value]) => {
        headers.set(header, value)
        return headers
      }, new Headers())

      if (this.headers) {
        this.headers.forEach((value, name) => {
          if (!headers.has(name)) {
            headers.append(name, value)
          }
        })
      }

      const response = await operation.invoke(body, headers)

      step.markExecuted()

      return {
        result: Result.Informational(`Invoked operation '${operation.title}'`),
        nextChecks: [getResponseRunner(response, step)],
      }
    }
  }

  protected appliesToInternal(): boolean {
    return true
  }
}
