import entrypointPresent from './entrypointCheck'
import hasSupportedClasses from './hasSupportedClasses'
import { checkChain, Result } from '../../check'
import { Hydra, rdf } from '../../namespace'

export default function (graph: any): checkChain[] {
    const apiDoc = graph.has(rdf.type, Hydra.ApiDocumentation)

    if (apiDoc.values.length > 1) {
        return [
            () => ({
                result: Result.Failure('Multiple ApiDocumentation resources found in representation')
            })
        ]
    }

    if (apiDoc.values.length === 0) {
        return [
            () => ({
                result: Result.Failure('ApiDocumentation resource not found in the representation')
            })
        ]
    }

    return [
        entrypointPresent(apiDoc),
        hasSupportedClasses(apiDoc)
    ]
}
