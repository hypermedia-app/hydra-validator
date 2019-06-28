import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { ResponseAssertion } from '../../../../types'
import { checkChain, IResult, Result, Context } from 'hydra-validator-core'

export default function (response: IHydraResponse, expectation: ResponseAssertion, scope: Context): checkChain {
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
