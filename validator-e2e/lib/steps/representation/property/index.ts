import { HydraResource, IHydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from '../../'
import { expand } from '@zazuko/rdf-vocabularies'

interface PropertyStepInit {
    propertyId: string;
    value?: unknown;
    strict: boolean;
}

export class PropertyStep extends ScenarioStep {
    public propertyId: string
    public strict: boolean
    public expectedValue?: unknown

    public constructor (init: PropertyStepInit, children: ScenarioStep[]) {
        super(children)

        this.propertyId = init.propertyId
        this.strict = init.strict
        this.expectedValue = init.value
    }

    protected appliesToInternal (obj: { [ prop: string ]: HydraResource }): boolean {
        return typeof obj === 'object' && 'id' in obj
    }

    public getRunner (resource: { [ prop: string ]: HydraResource } & HydraResource): checkChain<E2eContext> {
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

            if (step.expectedValue) {
                return step.__executeStatement(resource[step.propertyId])
            }

            return step.__executeBlock(resource[step.propertyId], this)
        }
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

    private __getMissingPropertyResult (resource: { [ prop: string ]: HydraResource }) {
        let result
        if (this.strict) {
            result = Result.Failure(`Property ${this.propertyId} missing on resource ${resource.id}`)
        } else {
            result = Result.Informational(`Skipping missing property ${this.propertyId}`)
        }

        return { result }
    }

    private __executeStatement (value: unknown): CheckResult<E2eContext> {
        // eslint-disable-next-line eqeqeq
        if (value == this.expectedValue) {
            return {
                result: Result.Success(`Property ${this.propertyId} as expected`),
            }
        }

        return {
            result: Result.Failure(`Expected ${this.propertyId} to equal ${this.expectedValue} but found ${value}`),
        }
    }

    private __executeBlock (value: IHydraResource, context: E2eContext): CheckResult<E2eContext> {
        const result = Result.Informational(`Stepping into property ${this.propertyId}`)

        return {
            result,
            nextChecks: this._getChildChecks(value, context.scenarios),
        }
    }
}
