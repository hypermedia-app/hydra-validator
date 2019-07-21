import ensureSingleNode from './ensure-single-resource'
import { Hydra, rdf } from 'hydra-validator-core/namespace'

export default function (graph: any) {
    const apiDocs = graph.has(rdf.type, Hydra.ApiDocumentation)

    return [
        ensureSingleNode(apiDocs),
    ]
}
