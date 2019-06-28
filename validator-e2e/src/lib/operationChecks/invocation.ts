import { IOperation } from 'alcaeus/types/Resources'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { InvocationStep, E2eContext } from '../../types'
import { checkChain, Result } from 'hydra-validator-core'
import { factory as responseChecks } from '../responseChecks'

export default function (operation: IOperation, step: InvocationStep): checkChain<E2eContext> {
    return async function () {
        if (step.executed) {
            return {}
        }
        const response: IHydraResponse = await operation.invoke(step.body || '')

        let nextChecks: checkChain<E2eContext>[] = []
        if (step.children) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            nextChecks = [ responseChecks(response, step.children) ]
        }

        step.executed = true

        return {
            result: Result.Informational(`Invoked operation '${operation.title}'`),
            nextChecks,
        }
    }
}
