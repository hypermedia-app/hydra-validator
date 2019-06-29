import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { IResult, Result, Context } from 'hydra-validator-core'
import { ScenarioStep } from '../../'

export class ExpectationStep extends ScenarioStep {
    public expectation: 'Status' | 'Header';
    public code: number;
    public name: string;
    public captureValueAs: string;

    public constructor (step: any, children: ScenarioStep[]) {
        super(children)

        this.expectation = step.expectation
        this.code = step.code
        this.name = step.name
        this.captureValueAs = step.captureValueAs
    }

    protected appliesToInternal (response: IHydraResponse): boolean {
        return 'xhr' in response
    }

    public getRunner (response: IHydraResponse, scope: Context) {
        const expectation = this
        return function () {
            let result: IResult

            switch (expectation.expectation) {
                case 'Header':
                    result = response.xhr.headers.has(expectation.name)
                        ? Result.Success(`Found '${expectation.name}' header`)
                        : Result.Failure(`Expected to find response header ${expectation.name}`)

                    scope[expectation.captureValueAs] = response.xhr.headers.get(expectation.name)

                    break
                case 'Status':
                    result = response.xhr.status === expectation.code
                        ? Result.Success(`Status code '${expectation.code}'`)
                        : Result.Failure(`Expected status code ${expectation.code} but got ${response.xhr.status}`)
                    break
                default:
                    result = Result.Failure(`Unrecognized assertion ${expectation}`)
                    break
            }

            return {result}
        }
    }
}
