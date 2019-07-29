import { IOperation } from 'alcaeus/types/Resources'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../../../../types'
import { Result } from 'hydra-validator-core'
import processResponse from '../../../processResponse'
import { ScenarioStep } from '../../index'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const contentTypeHeader = 'content-type'

interface InvocationStepInit {
    body?: string | { path: string };
    headers?: { [key: string]: string };
}

export class InvocationStep extends ScenarioStep {
    private body?: (basePath: string) => BodyInit;
    private headers: Map<string, string>;

    public constructor (init: InvocationStepInit, children: ScenarioStep[]) {
        super(children)

        this.headers = Object.entries((init.headers || {}))
            .reduce((headers, kv) => {
                headers.set(kv[0].toLowerCase(), kv[1])
                return headers
            }, new Map())

        if (typeof init.body === 'string') {
            const body = init.body
            this.body = () => body
        } else if (init.body && init.body.path) {
            const path = init.body.path
            this.body = (basePath) => readFileSync(resolve(basePath, path))
        }
    }

    public getRunner (operation: IOperation) {
        const step = this
        return async function (this: E2eContext) {
            if (step.executed) {
                return {}
            }

            let body: BodyInit = ''
            if (step.body) {
                try {
                    body = await step.body(this.basePath)
                } catch (e) {
                    return {
                        result: Result.Error('Failed to load body', e),
                    }
                }
            }
            const response: IHydraResponse = await operation.invoke(body, step.headers.get(contentTypeHeader))

            step.markExecuted()

            return {
                result: Result.Informational(`Invoked operation '${operation.title}'`),
                nextChecks: [processResponse(response, step.children)],
            }
        }
    }
}
