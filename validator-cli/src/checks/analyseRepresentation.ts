// @ts-ignore
import * as clownface from 'clownface'
import {checkChain, Result} from '../check'
import {Hydra, rdf} from '../namespace'
import apiDocsChecks from './api-documentation'

export default function (response: Response & any): checkChain {
    return async function (): Promise<[ Result, Array<checkChain> ]> {
        const dataset = await response.dataset()

        dataset.match()

        const graph = clownface(dataset)

        const apiDocs = graph.has(rdf.type, Hydra.ApiDocumentation)
        const moreChecks = []

        if (apiDocs.values.length !== 0)
        {
            moreChecks.push(...apiDocsChecks(apiDocs))
        }

        return [
            Result.Success(`Successfully parsed ${dataset.length} triples`),
            moreChecks
        ]
    }
}
