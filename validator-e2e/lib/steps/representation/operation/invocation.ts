import { IOperation } from 'alcaeus/types/Resources'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../../../../types'
import { checkChain, Result } from 'hydra-validator-core'
import processResponse from '../../../processResponse'
import { ScenarioStep } from '../../index'

interface InvocationStepInit {
    body: string;
}

export class InvocationStep extends ScenarioStep {
    public body: string;

    public constructor (init: InvocationStepInit, children: ScenarioStep[]) {
        super(children)
        this.body = init.body
    }

    protected appliesToInternal (obj: IOperation): boolean {
        return 'invoke' in obj
    }

    public getRunner (operation: IOperation) {
        const step = this
        return async function () {
            if (step.executed) {
                return {}
            }
            const response: IHydraResponse = await operation.invoke(step.body || '')

            let nextChecks: checkChain<E2eContext>[] = []
            if (step.children) {
                nextChecks = [processResponse(response, step.children)]
            }

            step.markExecuted()

            return {
                result: Result.Informational(`Invoked operation '${operation.title}'`),
                nextChecks,
            }
        }
    }
}
