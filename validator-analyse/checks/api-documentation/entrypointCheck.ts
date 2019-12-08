import { checkChain, Result } from 'hydra-validator-core'
import { Hydra } from 'hydra-validator-core/namespace'
import checkDereference from '../url-resolvable'

export default function (apiDoc: any): checkChain {
  return function entrypoint() {
    const entrypoint = apiDoc.out(Hydra.entrypoint)

    if (entrypoint.values.length === 0) {
      return {
        result: Result.Warning('Entrypoint not found in api documentation'),
      }
    }

    if (entrypoint.term.termType === 'Literal') {
      return {
        result: Result.Failure(`hydra:entrypoint property found but the value was a literal`),
      }
    }

    return {
      result: Result.Success(`Entrypoint found: ${entrypoint.term.value}`),
      nextChecks: [checkDereference(entrypoint.term.value, { fetchOnly: true })],
    }
  }
}
