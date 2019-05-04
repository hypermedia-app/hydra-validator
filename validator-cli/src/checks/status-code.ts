import {Either} from 'tsmonad'
import {Response} from 'node-fetch';
import abstractCheck from './check'

export default abstractCheck<Response, string>(
    'Status code must be 1xx or 2xx',
    response => {
        if (response.ok) {
            return Either.left({
                value: response.text(),
            })
        } else {
            return Either.right({
                kind: 'failed',
                reason: `Response failed with status ${response.status}`
            })
        }
    })
