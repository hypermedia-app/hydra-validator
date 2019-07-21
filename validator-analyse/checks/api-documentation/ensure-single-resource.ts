import { checkChain, Result } from 'hydra-validator-core'
import entrypointPresent from './entrypointCheck'
import hasSupportedClasses from './hasSupportedClasses'

export default function (apiDocumentation: any): checkChain {
    const nextChecks = [
        entrypointPresent(apiDocumentation),
        hasSupportedClasses(apiDocumentation),
    ]

    return function ensureSingleNode () {
        if (apiDocumentation.values.length > 1) {
            return {
                result: Result.Failure('Multiple ApiDocumentation resources found in representation'),
            }
        }

        if (apiDocumentation.values.length === 0) {
            return {
                result: Result.Failure('ApiDocumentation resource not found in the representation'),
            }
        }

        this.apiDocumentation = apiDocumentation

        return {
            nextChecks,
            sameLevel: true,
        }
    }
}
