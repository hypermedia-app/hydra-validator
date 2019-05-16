import {checkChain, Result} from '../../check';

export default function (response: Response): checkChain {
    return function statusCode() {
        if(response.ok) {
            return {
                messages: Result.Success(`Response status ${response.status}`)
            }

        } else {
            return {
                messages: Result.Failure('Request failed', `Status code was ${response.status}`)
            }
        }
    }
}
