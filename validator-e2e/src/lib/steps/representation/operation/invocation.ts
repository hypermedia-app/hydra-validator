import { IOperation } from 'alcaeus/types/Resources'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../../../../types'
import { checkChain, Result } from 'hydra-validator-core'
import { factory as responseChecks } from '../../response'
import { ScenarioStep } from '../../index'

export class InvocationStep extends ScenarioStep {
    public body: any;

    public constructor (body: any, children: ScenarioStep[]) {
        super(children)
        this.body = body
    }

    protected appliesToInternal (obj: any): boolean {
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
                nextChecks = [responseChecks(response, step.children)]
            }

            step.markExecuted()

            return {
                result: Result.Informational(`Invoked operation '${operation.title}'`),
                nextChecks,
            }
        }
    }
}
