import {checkChain, Result} from '../../check';

export default function (response: Response): checkChain {
    return function statusCode() {
        if(response.ok) {
            return {
                message: Result.Success(`Response status ${response.status}`)
            }

        } else {
            return {
                message: Result.Failure('Request failed', `Status code was ${response.status}`)
            }
        }
    }
}
