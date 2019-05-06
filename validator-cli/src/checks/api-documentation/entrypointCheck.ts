import {checkChain} from "../../check";
import {Result} from '../../check';
import {Hydra} from '../../namespace'
import checkDereference from '../url-resolvable'

export default function (apiDoc: any): checkChain {
    return function () {
        const entrypoint = apiDoc.out(Hydra.entrypoint)

        if (entrypoint.values.length === 0) {
            return [
                Result.Warning('Entrypoint not found in api documentation')
            ]
        }

        if (entrypoint.term.termType === 'Literal') {
            return [
                Result.Failure(`hydra:entrypoint property found but the value was a literal`)
            ]
        }

        return [
            Result.Success(`Entrypoint found: ${entrypoint.term.value}`),
            [checkDereference(entrypoint.term.value, true)]
        ]
    }
}
