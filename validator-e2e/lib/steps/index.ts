import { checkChain, Context } from 'hydra-validator-core'
import { E2eContext } from '../../types'
import { Constraint } from './constraints/Constraint'

export abstract class ScenarioStep<T = unknown> {
    public children: ScenarioStep[];
    public constraints: Constraint[];
    private __executed = false

    protected constructor (children: ScenarioStep[], constraints?: Constraint[]) {
        this.children = children
        this.constraints = constraints || []
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
    protected abstract appliesToInternal (obj: T): boolean
}

export abstract class ResponseStep extends ScenarioStep<Response> {
    protected appliesToInternal (obj: Response): boolean {
        return obj instanceof Response
    }
}
