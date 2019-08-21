import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from '../../'
import { expand } from '@zazuko/rdf-vocabularies'
import areEqual from '../../../comparison'
import { getResourceRunner } from '../../../processResponse'

interface PropertyStepInit {
    propertyId: string;
    value?: unknown;
    strict: boolean;
}

export class PropertyStep extends ScenarioStep<HydraResource> {
    public propertyId: string
    public strict: boolean
    public expectedValue?: unknown

    public constructor (init: PropertyStepInit, children: ScenarioStep[]) {
        super(children)

        this.propertyId = init.propertyId
        this.strict = init.strict
        this.expectedValue = init.value
    }

    protected appliesToInternal (obj: HydraResource): boolean {
        return typeof obj === 'object' && 'id' in obj
    }

    public getRunner (resource: HydraResource): checkChain<E2eContext> {
        const step = this

        if (step.children.length > 0 && !!step.expectedValue) {
            return function (): CheckResult<E2eContext> {
                return {
                    result: Result.Error("Property step cannot mix both 'value' and child steps"),
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

    private __checkValues (value: HydraResource | HydraResource[], context: E2eContext, arrayItem = false): CheckResult<E2eContext> {
        if (Array.isArray(value)) {
            return {
                result: Result.Informational(`Stepping into members of array ${this.propertyId}`),
                nextChecks: value.map((v, i) => this.__checkArrayItem(v, i)),
            }
        }

        if (typeof this.expectedValue !== 'undefined' && this.expectedValue !== null) {
            return this.__executeStatement(value)
        }

        if (!this.children || this.children.length === 0) {
            return {
                result: Result.Success(`Found expected property ${this.propertyId}`),
            }
        }

        return this.__executeBlock(value as HydraResource, context, arrayItem)
    }

    private __executeRdfTypeStatement (resource: HydraResource) {
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

    private __getMissingPropertyResult (resource: HydraResource) {
        let result
        if (this.strict) {
            result = Result.Failure(`Property ${this.propertyId} missing on resource ${resource.id}`)
        } else {
            result = Result.Informational(`Skipping missing property ${this.propertyId}`)
        }

        return { result }
    }

    private __executeStatement (value: unknown): CheckResult<E2eContext> {
        if (areEqual(this.expectedValue, value)) {
            return {
                result: Result.Success(`Found ${this.propertyId} property with expected value`),
            }
        }

        return {
            result: Result.Failure(`Expected ${this.propertyId} to equal ${this.expectedValue} but found ${value}`),
        }
    }

    private __executeBlock (value: HydraResource, context: E2eContext, arrayItem: boolean): CheckResult<E2eContext> {
        const result = Result.Informational(`Stepping into property ${this.propertyId}`)
        const nextChecks = [ getResourceRunner(value, this.children) ]

        if (arrayItem) {
            return { nextChecks }
        }

        return { result, nextChecks }
    }

    private __checkArrayItem (value: HydraResource, index: number): checkChain<E2eContext> {
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
                    return step.__checkValues(value, this, true)
                }],
            }
        }
    }
}
