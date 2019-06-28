import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext, OperationStep, InvocationStep } from '../../types'
import { Result, checkChain } from 'hydra-validator-core'
import invocation from './invocation'

export default function (resource: HydraResource, step: OperationStep): checkChain<E2eContext> {
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
            step.children.filter(child => child.type === 'Invocation')
                .reduce((checks, child) => {
                    checks.push(invocation(operation, child as InvocationStep))
                    return checks
                }, nextChecks)
        }

        step.executed = true

        return {
            result: Result.Informational(`Found operation '${operation.title}'`),
            nextChecks,
        }
    }
}
