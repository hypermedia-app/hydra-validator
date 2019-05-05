import fetch from 'node-fetch'
import {checkChain, Result} from './check';
import statusCheck from './status-code'
import apiDocLink from './api-doc-link'

export default function<T, R> (url: string): checkChain {
    return async function (): Promise<[ Result, Array<checkChain> ]> {
        try {
            const response = await fetch(url)

            return [
                Result.Success(`Successfully fetched ${url}`),
                [statusCheck(response), apiDocLink(response)]
            ]
        } catch (e) {
            return [
                Result.Failure('Fetch failed', e), []
            ]
        }
    }
}
