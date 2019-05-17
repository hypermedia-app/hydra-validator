// @ts-ignore
import * as clownface from 'clownface'
import { checkChain, Result } from '../check'
import apiDocsChecks from './api-documentation'

export default function (response: Response & any, isApiDoc: boolean): checkChain {
    return function representation () {
        return response.dataset()
            .then((dataset: any) => {
                const graph = clownface(dataset)

                const nextChecks = []

                if (isApiDoc) {
                    nextChecks.push(...apiDocsChecks(graph))
                }

                return {
                    result: Result.Success(`Successfully parsed ${dataset.length} triples`),
                    nextChecks,
                    sameLevel: true
                }
            })
            .catch((e: Error) => {
                return {
                    result: Result.Failure(`Failed to parse ${response.url}`, e)
                }
            })
    }
}
