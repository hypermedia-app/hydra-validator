import { Resource } from 'alcaeus'
import { E2eContext } from '../../../types'
import { checkChain } from 'hydra-validator-core'
import { ScenarioStep } from '../index'
import { getResourceRunner } from '../../checkRunner'
import { Constraint } from '../constraints/Constraint'

interface ClassStepInit {
  classId: string
}

export class ClassStep extends ScenarioStep {
  public classId: string

  public constructor(init: ClassStepInit, children: ScenarioStep[], constraints: Constraint[]) {
    super(children, constraints)

    this.classId = init.classId
  }

  protected appliesToInternal(obj: Resource): boolean {
    return 'id' in obj && obj.types.has(this.classId)
  }

  public getRunner(resource: Resource): checkChain<E2eContext> {
    const step = this

    return function checkRepresentation() {
      return {
        nextChecks: [getResourceRunner(resource, step)],
      }
    }
  }
}
