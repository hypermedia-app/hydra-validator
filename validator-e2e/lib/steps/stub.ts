import { ScenarioStep } from './index'
import { checkChain } from 'hydra-validator-core'

export class StepStub extends ScenarioStep {
    private readonly runner: checkChain

    public constructor (name: string) {
        super([])

        // eslint-disable-next-line no-new-func
        this.runner = new Function(
            `return function ${name}() { }`
        )()
    }

    protected appliesToInternal (): boolean {
        return true
    }

    public getRunner () {
        return this.runner
    }
}
