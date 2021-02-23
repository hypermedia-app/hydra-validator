import { ScenarioStep } from '../../index'
import { Resource } from 'alcaeus'
import { E2eContext } from '../../../../types'
import { checkChain, Result } from 'hydra-validator-core'
import { NamedNode } from 'rdf-js'
import { namedNode } from '@rdf-esm/data-model'

interface IdentifierStepInit {
  value: string
}

export class IdentifierStep extends ScenarioStep<Resource> {
  private readonly __identifier: NamedNode

  public constructor(init: IdentifierStepInit) {
    super([])

    this.__identifier = namedNode(init.value)
  }

  protected appliesToInternal(): boolean {
    return true
  }

  public getRunner(obj: Resource): checkChain<E2eContext> {
    const { __identifier } = this
    return function () {
      let result: Result

      if (typeof obj !== 'object') {
        result = Result.Failure(`Expected <${__identifier.value}> resource but the value is a ${typeof obj}`)
      } else if (__identifier.equals(obj.id)) {
        result = Result.Success(`Found expected resource identifier ${__identifier.value}`)
      } else {
        result = Result.Failure(`Expect resource <${__identifier.value}> but got <${obj.id.value}> instead.`)
      }

      return {
        result,
      }
    }
  }
}
