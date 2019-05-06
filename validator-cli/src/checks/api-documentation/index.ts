import entrypointPresent from './entrypointCheck'
import hasSupportedClasses from './hasSupportedClasses'
import {checkChain, Result} from '../../check';

export default function (apiDoc: any): checkChain[] {
    if (apiDoc.values.length > 1) {
        return [
            () => [
                Result.Failure('Multiple ApiDocumentation resources found in representation')
            ]
        ]
    }

    return [
        entrypointPresent(apiDoc),
        hasSupportedClasses(apiDoc)
    ]
}
