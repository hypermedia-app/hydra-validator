import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../../types'
import { Result, checkChain } from 'hydra-validator-core'
import { ScenarioStep } from '../../index'

interface OperationStepInit {
    operationId: string;
}

export class OperationStep extends ScenarioStep {
    public operationId: string;

    public constructor (init: OperationStepInit, children: ScenarioStep[]) {
        super(children)
        this.operationId = init.operationId
    }

    protected appliesToInternal (obj: HydraResource): boolean {
        return 'id' in obj
    }

    public getRunner (resource: HydraResource) {
        const step = this
        return async function invokeOperation () {
            const operation = resource.operations.find(op => op.supportedOperation.id === step.operationId)
            if (!operation) {
                return {
                    result: Result.Failure(`Operation ${step.operationId} not found`),
                }
            }

            if (step.executed) {
                return {}
            }

            let nextChecks: checkChain<E2eContext>[] = []
            if (step.children) {
                step.children
                    .reduce((checks, child) => {
                        if (child.appliesTo(operation)) {
                            checks.push(child.getRunner(operation))
                        }
                        return checks
                    }, nextChecks)
            }

            step.markExecuted()

            return {
                result: Result.Informational(`Found operation '${operation.title}'`),
                nextChecks,
            }
        }
    }
}
