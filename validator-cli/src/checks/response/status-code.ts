import { checkChain, Result } from '../../check'

export default function (response: Response): checkChain {
    return function statusCode () {
        if (response.ok) {
            return {
                result: Result.Success(`Response status ${response.status}`),
            }
        } else {
            return {
                result: Result.Failure('Request failed', `Status code was ${response.status}`),
            }
        }
    }
}
