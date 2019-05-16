// @ts-ignore
import * as fetch from 'rdf-fetch'
import {Result} from '../check';
import statusCheck from './response/status-code'
import apiDocLink from './response/api-doc-link'
import analyseRepresentation from './analyseRepresentation'

export default function (url: string, {fetchOnly = false} = {}) {
    return function tryFetch() {
        return fetch(url)
            .then((response: Response) => {
                const nextChecks = [
                    statusCheck(response)
                ]

                if (!fetchOnly) {
                    nextChecks.push(apiDocLink(response), analyseRepresentation(response))
                }

                return {
                    message: Result.Success(`Successfully fetched ${url}`),
                    nextChecks
                }
            })
            .catch((e: Error) => ({
                message: Result.Failure('Failed to fetch resource', e)
            }))
    }
}
