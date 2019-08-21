import { checkChain, Context } from 'hydra-validator-core'
import { E2eContext } from '../../types'

export abstract class ScenarioStep<T = unknown> {
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

    public appliesTo (obj: T): boolean {
        return !!obj && this.appliesToInternal(obj)
    }

    abstract getRunner(obj: T, localContext?: Context): checkChain<E2eContext>;
    protected appliesToInternal (obj: T): boolean {
        return true
    }
}
