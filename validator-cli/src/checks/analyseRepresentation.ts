// @ts-ignore
import * as clownface from 'clownface'
import { checkChain, Result } from '../check'
import { Hydra, rdf } from '../namespace'
import apiDocsChecks from './api-documentation'

export default function (response: Response & any): checkChain {
    return async function representation () {
        const dataset = await response.dataset()

        const graph = clownface(dataset)

        const apiDocs = graph.has(rdf.type, Hydra.ApiDocumentation)
        const nextChecks = []

        if (apiDocs.values.length !== 0) {
            nextChecks.push(...apiDocsChecks(apiDocs))
        }

        return {
            result: Result.Success(`Successfully parsed ${dataset.length} triples`),
            nextChecks
        }
    }
}
