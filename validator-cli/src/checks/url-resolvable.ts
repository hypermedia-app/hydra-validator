// @ts-ignore
import * as fetch from 'rdf-fetch'
import {Result} from '../check';
import statusCheck from './response/status-code'
import apiDocLink from './response/api-doc-link'
import analyseRepresentation from './analyseRepresentation'

export default function (url: string, {fetchOnly = false} = {}) {
    return async function tryFetch() {
        const response = await fetch(url)

        const nextChecks = [
            statusCheck(response)
        ]

        if (!fetchOnly) {
            nextChecks.push(apiDocLink(response), analyseRepresentation(response))
        }

        return {
            messages: Result.Success(`Successfully fetched ${url}`),
            nextChecks
        }
    }
}
