import { ScenarioStep } from './index'
import { checkChain, Context } from 'hydra-validator-core'
import { E2eContext } from '../../types'

interface ScenarioStepImpl<T> {
    getRunner(obj: T, localContext?: Context): checkChain<E2eContext>;
}

type StepConstructor<T> = new (...args: any[]) => ScenarioStepImpl<T> & ScenarioStep<T>

type ReturnConstructor<T> = new (...args: any[]) => ScenarioStepImpl<T> & {
    visited: boolean;
}

export function SpyMixin<T, B extends StepConstructor<T>> (Base: B): B & ReturnConstructor<T> {
    abstract class StepSpyDecorator extends Base {
        private __visited = false

        public get visited () {
            return this.__visited
        }

        public getRunner (obj: T, localContext?: Context) {
            const realRunner = super.getRunner(obj, localContext)
            const step = this

            return function (this: E2eContext) {
                step.__visited = true
                return realRunner.call(this)
            }
        }
    }

    return StepSpyDecorator
}
