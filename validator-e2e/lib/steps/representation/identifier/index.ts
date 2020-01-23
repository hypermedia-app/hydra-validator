import { ScenarioStep } from '../../index'
import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { checkChain, Result } from 'hydra-validator-core'
import { NamedNode } from 'rdf-js'
import { namedNode } from '@rdfjs/data-model'

interface IdentifierStepInit {
  value: string
}

export class IdentifierStep extends ScenarioStep<HydraResource> {
  private readonly __identifier: NamedNode

  public constructor(init: IdentifierStepInit) {
    super([])

    this.__identifier = namedNode(init.value)
  }

  protected appliesToInternal(): boolean {
    return true
  }

  public getRunner(obj: HydraResource): checkChain<E2eContext> {
    const { __identifier } = this
    return function () {
      let result: Result

      if (typeof obj !== 'object') {
        result = Result.Failure(`Expected <${__identifier}> resource but the value is a ${typeof obj}`)
      } else if (__identifier.equals(obj.id)) {
        result = Result.Success(`Found expected resource identifier ${__identifier}`)
      } else {
        result = Result.Failure(`Expect resource <${__identifier}> but got <${obj.id.value}> instead.`)
      }

      return {
        result,
      }
    }
  }
}
