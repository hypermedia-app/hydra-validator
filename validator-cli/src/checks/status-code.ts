import {Response} from 'node-fetch'
import {checkChain, Result} from '../check';

export default function(response: Response): checkChain {
    return () => {
        if(response.ok) {
            return [
                Result.Success(`Response status ${response.status}`), []
            ]
        } else {
            return [
                Result.Failure('Request failed', `Status code was ${status}`), []
            ]
        }
    }
}
