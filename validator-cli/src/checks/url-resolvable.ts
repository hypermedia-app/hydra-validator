// @ts-ignore
import * as fetch from 'rdf-fetch'
import { Result } from '../check'
import statusCheck from './response/status-code'
import apiDocLink from './response/api-doc-link'
import analyseRepresentation from './analyse-representation'

export default function (url: string, { fetchOnly = false, isApiDoc = false } = {}) {
    return function tryFetch () {
        return fetch(url)
            .then(async (response: Response) => {
                const nextChecks = [
                    statusCheck(response)
                ]

                if (!fetchOnly) {
                    if (isApiDoc) {
                        nextChecks.push(analyseRepresentation(response, true))
                    } else {
                        nextChecks.push(apiDocLink(response), analyseRepresentation(response, false))
                    }
                }

                return {
                    result: Result.Success(`Successfully fetched ${url}`),
                    nextChecks
                }
            })
            .catch((e: Error) => ({
                result: Result.Failure('Failed to fetch resource', e)
            }))
    }
}
