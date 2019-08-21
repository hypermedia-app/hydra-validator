import { ScenarioStep } from './index'
import { checkChain } from 'hydra-validator-core'
import { Constraint } from './constraints/Constraint'

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
    public readonly runner: jest.Mock
    public readonly realAppliesTo: jest.Mock

    public constructor () {
        super([])
        this.realAppliesTo = jest.fn().mockReturnValue(true)
        this.runner = jest.fn()
        this.runner.mockReturnValue({ })
    }

    public appliesTo (obj: unknown): boolean {
        return this.realAppliesTo(obj)
    }

    public getRunner () {
        return this.runner
    }

    protected appliesToInternal (): boolean {
        throw new Error('Not implemented')
    }
}

export class ConstraintMock extends Constraint<unknown> {
    public type: 'Representation' | 'Response' | null

    public constructor (mockResult: boolean = true, type?: 'Representation' | 'Response') {
        super(() => mockResult, false)

        this.type = type || null
    }

    protected getValue (subject: unknown): unknown {
        return undefined
    }

    protected sanityCheckValue (value: unknown): boolean {
        return true
    }
}
