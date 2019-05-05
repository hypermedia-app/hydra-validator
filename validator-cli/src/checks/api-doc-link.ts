import {checkChain, Result} from './check';
import {Response} from 'node-fetch';
// import parse from 'parse-link-header'

export default function(response: Response): checkChain {
    return function () {
        if (!response.headers.has('link')) {
            return [
                Result.Failure('Link header missing'), []
            ]
        }

        return [ Result.Success('Got link header'), []]
    }
}
