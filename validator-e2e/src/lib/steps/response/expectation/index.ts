import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { checkChain, IResult, Result, Context } from 'hydra-validator-core'
import { ScenarioStep } from '../../'

export interface ExpectationStep extends ScenarioStep {
    expectation: 'Status' | 'Header';
    code: number;
    name: string;
    captureValueAs: string;
}

export default function (response: IHydraResponse, expectation: ExpectationStep, scope: Context): checkChain {
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
                result = Result.Failure(`Unrecognized assertion ${expectation.type}`)
                break
        }

        return { result }
    }
}
