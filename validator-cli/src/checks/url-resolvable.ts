// @ts-ignore
import * as fetch from 'rdf-fetch'
import {checkChain, Result} from '../check';
import statusCheck from './status-code'
import apiDocLink from './api-doc-link'
import analyseRepresentation from './analyseRepresentation'

export default function<T, R> (url: string): checkChain {
    return async function (): Promise<[ Result, Array<checkChain> ]> {
        const response = await fetch(url)

        return [
            Result.Success(`Successfully fetched ${url}`),
            [statusCheck(response), apiDocLink(response), analyseRepresentation(response)]
        ]
    }
}
