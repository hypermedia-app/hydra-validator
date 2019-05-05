// @ts-ignore
import * as fetch from 'rdf-fetch'
import {checkChain, Result} from '../check';
import statusCheck from './status-code'
import apiDocLink from './api-doc-link'
import analyseRepresentation from './analyseRepresentation'

export default function<T, R> (url: string, fetchOnly = false): checkChain {
    return async function (): Promise<[ Result, Array<checkChain> ]> {
        const response = await fetch(url)

        const checks = [
            statusCheck(response)
        ]

        if (!fetchOnly) {
           checks.push(apiDocLink(response), analyseRepresentation(response))
        }

        return [
            Result.Success(`Successfully fetched ${url}`),
            checks
        ]
    }
}
