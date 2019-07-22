import { HydraResource, IHydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from '../../'

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

    public getRunner (resource: { [ prop: string ]: HydraResource }): checkChain<E2eContext> {
        const step = this

        if (step.children.length > 0 && !!step.expectedValue) {
            return function (): CheckResult<E2eContext> {
                return {
                    result: Result.Error("Property step cannot mix both 'value' and child steps"),
                }
            }
        }

        return function () {
            if (!(step.propertyId in resource)) {
                let result
                if (step.strict) {
                    result = Result.Failure(`Property ${step.propertyId} missing on resource ${resource.id}`)
                } else {
                    result = Result.Informational(`Skipping missing property ${step.propertyId}`)
                }

                return { result }
            }

            if (step.expectedValue) {
                return step.__executeStatement(resource[step.propertyId])
            }

            return step.__executeBlock(resource[step.propertyId], this)
        }
    }

    private __executeStatement (value: unknown): CheckResult<E2eContext> {
        if (value === this.expectedValue) {
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

        let nextChecks: checkChain<E2eContext>[] = []
        if (result.status !== 'failure') {
            [...this.children, ...context.scenarios].reduce((checks, child) => {
                if (child.appliesTo(value)) {
                    checks.push(child.getRunner(value))
                }
                return checks
            }, nextChecks)
        }

        return {
            result,
            nextChecks,
        }
    }
}
