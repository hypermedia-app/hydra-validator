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

export class StepSpy extends ScenarioStep {
    private readonly runner: jest.Mock

    public constructor () {
        super([])
        this.runner = jest.fn()
        this.runner.mockReturnValue({ })
    }

    public getRunner () {
        return this.runner
    }
}
