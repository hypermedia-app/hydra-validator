import fetch, {Response} from 'node-fetch'
import {Result} from './check';
import statusCheck from './status-code'
import apiDocLink from './api-doc-link'

export type checkChain = () => Promise<[ Result, Array<checkChain> ]> | [ Result, Array<checkChain> ]

export default async function<T, R> (url: string): Promise<[ Result, Array<checkChain> ]> {
    try {
        const response = await fetch(url)

        return [
            Result.Success(`Successfully fetched ${url}`),
            [ statusCheck(response), apiDocLink(response) ]
        ]
    } catch (e) {
        return [ Result.Failure<Response>('Fetch failed', e), [] ]
    }
}
