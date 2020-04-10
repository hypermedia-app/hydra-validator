import clownface from 'clownface'
import DatasetExt from 'rdf-ext/lib/Dataset'
import { checkChain, Result } from 'hydra-validator-core'
import apiDocsChecks from './api-documentation'

export default function (response: Response & any, isApiDoc: boolean): checkChain {
  return function representation() {
    return response.dataset()
      .then((dataset: DatasetExt) => {
        const graph = clownface({ dataset })

        const nextChecks = []

        if (isApiDoc) {
          nextChecks.push(...apiDocsChecks(graph))
        }

        return {
          result: Result.Success(`Successfully parsed ${dataset.length} triples`),
          nextChecks,
          sameLevel: true,
        }
      })
      .catch((e: Error) => {
        return {
          result: Result.Failure(`Failed to parse ${response.url}`, e),
        }
      })
  }
}
