import { NamedNode } from 'rdf-js'
import { namedNode } from '@rdfjs/data-model'
import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from '../../'
import { expand } from '@zazuko/rdf-vocabularies'
import areEqual from '../../../comparison'
import { getResourceRunner } from '../../../checkRunner'
import { Constraint } from '../../constraints/Constraint'

interface PropertyStepInit {
  propertyId: string
  value?: unknown
  strict: boolean
}

export class PropertyStep extends ScenarioStep<HydraResource> {
  public propertyId: NamedNode
  public strict: boolean
  public expectedValue?: unknown

  public constructor(init: PropertyStepInit, children: ScenarioStep[], constraints: Constraint[]) {
    super(children, constraints)

    this.propertyId = namedNode(init.propertyId)
    this.strict = init.strict
    this.expectedValue = init.value
  }

  protected appliesToInternal(obj: HydraResource): boolean {
    return typeof obj === 'object' && 'id' in obj
  }

  public getRunner(resource: HydraResource): checkChain<E2eContext> {
    const step = this

    if (step.children.length > 0 && !!step.expectedValue) {
      return function (): CheckResult<E2eContext> {
        return {
          result: Result.Error("Property step cannot mix both 'value' and child steps"),
        }
      }
    }

    if (step.constraints.length > 0 && !!step.expectedValue) {
      return function (): CheckResult<E2eContext> {
        return {
          result: Result.Error('Property statement cannot have constraints'),
        }
      }
    }

    return function () {
      if (step.propertyId.equals(expand('rdf:type'))) {
        return step.__executeRdfTypeStatement(resource)
      }

      const value = resource.getArray<HydraResource>(step.propertyId)
      if (value.length === 0) {
        return step.__getMissingPropertyResult(resource)
      }

      return step.__checkValues(value, this)
    }
  }

  private __checkValues(values: HydraResource[], context: E2eContext, arrayItem = false): CheckResult<E2eContext> {
    if (Array.isArray(values) && values.length > 1) {
      return {
        result: Result.Informational(`Stepping into members of array ${this.propertyId.value}`),
        nextChecks: values.map((v, i) => this.__checkArrayItem(v, i)),
      }
    }

    const value = values[0]
    if (typeof this.expectedValue !== 'undefined' && this.expectedValue !== null) {
      return this.__executeStatement(value)
    }

    if (!this.children || this.children.length === 0) {
      return {
        result: Result.Success(`Found expected property ${this.propertyId.value}`),
      }
    }

    return this.__executeBlock(value as HydraResource, context, arrayItem)
  }

  private __executeRdfTypeStatement(resource: HydraResource) {
    if (!this.strict) {
      return { result: Result.Error('Expect Type statement must be strict') }
    }

    let result
    const hasType = resource.types.has(this.expectedValue as string)
    if (hasType) {
      result = Result.Success(`Found type ${this.expectedValue}`)
    } else {
      result = Result.Failure(`Resource ${resource.id} does not have expected RDF type ${this.expectedValue}`)
    }

    return { result }
  }

  private __getMissingPropertyResult(resource: HydraResource) {
    let result
    if (this.strict) {
      result = Result.Failure(`Property ${this.propertyId.value} missing on resource ${resource.id}`)
    } else {
      result = Result.Informational(`Skipping missing property ${this.propertyId.value}`)
    }

    return { result }
  }

  private __executeStatement(value: unknown): CheckResult<E2eContext> {
    if (areEqual(this.expectedValue, value)) {
      return {
        result: Result.Success(`Found ${this.propertyId.value} property with expected value`),
      }
    }

    return {
      result: Result.Failure(`Expected ${this.propertyId.value} to equal ${this.expectedValue} but found ${value}`),
    }
  }

  private __executeBlock(value: HydraResource, context: E2eContext, arrayItem: boolean): CheckResult<E2eContext> {
    const result = Result.Informational(`Stepping into property ${this.propertyId.value}`)
    const nextChecks = [ getResourceRunner(value, this) ]

    if (arrayItem) {
      return { nextChecks }
    }

    return { result, nextChecks }
  }

  private __checkArrayItem(value: HydraResource, index: number): checkChain<E2eContext> {
    const step = this
    if (Array.isArray(value)) {
      return () => ({
        result: Result.Warning(`Cannot check value at index ${index}`, 'Nested arrays are not supported'),
      })
    }

    return function () {
      return {
        result: Result.Informational(`Array item at index ${index}`),
        nextChecks: [function () {
          return step.__checkValues([value], this, true)
        }],
      }
    }
  }
}
