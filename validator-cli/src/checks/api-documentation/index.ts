import entrypointPresent from './entrypointCheck'
import hasSupportedClasses from './hasSupportedClasses'
import {checkChain, Result} from '../../check';

export default function (apiDoc: any) {
    if (apiDoc.values.length > 1) {
        return [
            () => [
                Result.Failure('Multiple ApiDocumentation resources found in representation'),
                []
            ] as [Result, checkChain[]]
        ]
    }

    return [
        entrypointPresent(apiDoc),
        hasSupportedClasses(apiDoc)
    ]
}
