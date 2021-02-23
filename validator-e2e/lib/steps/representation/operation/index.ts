import { E2eContext } from '../../../../types'
import { checkChain, Result } from 'hydra-validator-core'
import { ScenarioStep } from '../../index'
import { getResourceRunner } from '../../../checkRunner'
import { Resource, ResourceIdentifier } from 'alcaeus'
import { namedNode } from '@rdfjs/data-model'

interface OperationStepInit {
  operationId: string
  strict: boolean
}

export class OperationStep extends ScenarioStep {
  public operationId: ResourceIdentifier;
  public strict: boolean;

  public constructor(init: OperationStepInit, children: ScenarioStep[]) {
    super(children)
    this.operationId = namedNode(init.operationId)
    this.strict = init.strict
  }

  protected appliesToInternal(obj: Resource): boolean {
    return 'operations' in obj
  }

  public getRunner(resource: Resource): checkChain<E2eContext> {
    const step = this
    return async function invokeOperation(this: E2eContext) {
      const operation = resource.operations.find(op => op.id.equals(step.operationId) || op.types.has(step.operationId))
      if (!operation) {
        const message = `Operation ${step.operationId.value} not found`
        if (step.strict) {
          return {
            result: Result.Failure(message),
          }
        }

        // TODO: add a 'debug' result for diagnostic purposes
        return {}
      }

      if (step.executed) {
        return {}
      }

      step.markExecuted()

      return {
        result: Result.Informational(`Found operation '${operation.title}'`),
        nextChecks: [getResourceRunner(operation, step)],
      }
    }
  }
}
