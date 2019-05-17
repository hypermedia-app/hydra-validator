import { checkChain, Result } from '../../check'
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

        return {
            nextChecks,
            context: {
                apiDocumentation,
            },
            sameLevel: true,
        }
    }
}
