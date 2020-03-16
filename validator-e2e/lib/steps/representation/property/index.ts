import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { checkChain, CheckResult, Result, IResult } from 'hydra-validator-core'
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

async function flattenResults(root: CheckResult<E2eContext>, context: E2eContext): Promise<IResult[]> {
  let results: IResult[] = []
  if (root.results) {
    results = root.results
  } else if (root.result) {
    results = [root.result]
  }

  if (!root.nextChecks || root.nextChecks.length === 0) {
    return results
  }

  let remainingChecks = [...root.nextChecks]
  while (remainingChecks.length > 0) {
    const child = remainingChecks.splice(0, 1)[0]
    const childResult = await child.call(context)

    results = [...results, ...await flattenResults(childResult, context)]
  }

  return results
}

export class PropertyStep extends ScenarioStep<HydraResource> {
  public propertyId: string
  public strict: boolean
  public expectedValue?: unknown

  public constructor(init: PropertyStepInit, children: ScenarioStep[], constraints: Constraint[]) {
    super(children, constraints)

    this.propertyId = init.propertyId
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
      if (step.propertyId === expand('rdf:type')) {
        return step.__executeRdfTypeStatement(resource)
      }

      if (!(step.propertyId in resource)) {
        return step.__getMissingPropertyResult(resource)
      }

      return step.__checkValues(resource[step.propertyId] as any, this)
    }
  }

  private __checkValues(value: HydraResource | HydraResource[], context: E2eContext, arrayItem = false): Promise<CheckResult<E2eContext>> | CheckResult<E2eContext> {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return {
          result: Result.Warning(`Found empty array for property ${this.propertyId}`),
        }
      }

      return this.__executeArray(value, context)
    }

    if (typeof this.expectedValue !== 'undefined' && this.expectedValue !== null) {
      return this.__executeStatement(value)
    }

    if (!this.children || this.children.length === 0) {
      return {
        result: Result.Success(`Found expected property ${this.propertyId}`),
      }
    }

    return this.__executeBlock(value as HydraResource, arrayItem)
  }

  private __executeRdfTypeStatement(resource: HydraResource) {
    if (!this.strict) {
      return { result: Result.Error('Expect Type statement must be strict') }
    }

    let result
    const hasType = resource.types.contains(this.expectedValue as string)
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
      result = Result.Failure(`Property ${this.propertyId} missing on resource ${resource.id}`)
    } else {
      result = Result.Informational(`Skipping missing property ${this.propertyId}`)
    }

    return { result }
  }

  private __executeStatement(value: unknown): CheckResult<E2eContext> {
    if (areEqual(this.expectedValue, value)) {
      return {
        result: Result.Success(`Found ${this.propertyId} property with expected value`),
      }
    }

    return {
      result: Result.Failure(`Expected ${this.propertyId} to equal ${this.expectedValue} but found ${value}`),
    }
  }

  private __executeBlock(value: HydraResource, arrayItem: boolean): CheckResult<E2eContext> {
    const result = Result.Informational(`Stepping into property ${this.propertyId}`)
    const nextChecks = [ getResourceRunner(value, this) ]

    if (arrayItem) {
      return { nextChecks }
    }

    return { result, nextChecks }
  }

  private async __executeArray(array: HydraResource[], context: E2eContext) {
    let anyFailed = false

    for (const value of array) {
      const childResult = await this.__checkValues(value, context, true)
      const allResults = await flattenResults(childResult, context)

      const noSuccessResults = allResults.every(r => r.status !== 'success')
      const someFailed = allResults.some(r => r.status === 'failure' || r.status === 'error')

      if (someFailed || noSuccessResults) {
        anyFailed = anyFailed || someFailed
        continue
      }

      return {
        result: Result.Success(`Found ${this.propertyId} property matching expected criteria`),
      }
    }

    if (!anyFailed) {
      return {
        result: Result.Informational(`No object of ${this.propertyId} property but no steps failed. Have all object been excluded by constraints?`),
      }
    }

    return {
      result: Result.Failure(`No object of ${this.propertyId} property was found matching the criteria`),
    }
  }
}
