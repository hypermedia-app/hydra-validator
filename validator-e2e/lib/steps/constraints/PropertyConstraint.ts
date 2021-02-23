import { RepresentationConstraint } from './Constraint'
import { Resource, ResourceIndexer } from 'alcaeus'
import { StepConstraintInit } from './'

export class PropertyConstraint extends RepresentationConstraint {
  private readonly __propertyName: string

  public constructor(init: StepConstraintInit, predicate: (value: any) => boolean, negated: boolean) {
    super(predicate, negated)

    if (!init.left) {
      throw new Error('Missing property name')
    }

    this.__propertyName = init.left
  }

  protected getValue(subject: Resource & ResourceIndexer) {
    return subject[this.__propertyName]
  }

  protected sanityCheckValue(value?: unknown): boolean {
    return !!value
  }
}
