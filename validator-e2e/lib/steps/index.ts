import { checkChain, Context } from 'hydra-validator-core'
import { E2eContext } from '../../types'

export abstract class ScenarioStep {
    public children: ScenarioStep[];
    private __executed = false

    protected constructor (children: ScenarioStep[]) {
        this.children = children
    }

    public get executed () {
        return this.__executed
    }

    protected markExecuted () {
        this.__executed = true
    }

    public appliesTo (obj: unknown): boolean {
        return !!obj && this.appliesToInternal(obj)
    }

    abstract getRunner(obj: unknown, localContext?: Context): checkChain<E2eContext>;
    protected appliesToInternal (obj: unknown): boolean {
        return true
    }
}
