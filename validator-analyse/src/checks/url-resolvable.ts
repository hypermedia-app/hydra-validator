import shimmed from '../rdf-fetch.shim'
import { Context, Result } from 'hydra-validator-core'
import statusCheck from './response/status-code'
import apiDocLink from './response/api-doc-link'
import analyseRepresentation from './analyse-representation'

export default function (url: string, { fetchOnly = false, isApiDoc = false } = {}) {
    return function tryFetch (this: Context) {
        const urlNormalised = new URL(url).toString()

        if (this.visitedUrls.includes(urlNormalised) !== false) {
            return {
                result: Result.Informational(`Skipping already visited resource <${url}>`),
            }
        }
        this.visitedUrls.push(urlNormalised)

        return this.fetch(url)
            .then(async (response: Response & any) => {
                response.dataset = shimmed.dataset.bind(response)

                const nextChecks = [
                    statusCheck(response),
                ]

                if (!fetchOnly) {
                    if (isApiDoc) {
                        nextChecks.push(analyseRepresentation(response, true))
                    } else {
                        nextChecks.push(apiDocLink(response))
                    }
                }

                return {
                    result: Result.Success(`Successfully fetched ${url}`),
                    nextChecks,
                }
            })
            .catch((e: Error) => ({
                result: Result.Failure('Failed to fetch resource', e),
            }))
    }
}
