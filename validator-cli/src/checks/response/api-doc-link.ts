import { checkChain, Result } from '../../check'
// @ts-ignore
import * as parse from 'parse-link-header'
import { Hydra } from '../../namespace'
import urlResolveCheck from '../url-resolvable'
import analyseRepresentation from '../analyse-representation'

export default function (response: Response): checkChain {
    return async function apiDocLink () {
        if (!response.headers.has('link')) {
            return {
                result: Result.Failure('Link header missing')
            }
        }

        const linkHeaders = response.headers.get('link')
        const links = parse(linkHeaders)

        if (!links[Hydra.apiDocumentation.value]) {
            return {
                result: Result.Failure(`rel=<${Hydra.apiDocumentation.value}> link not found in the response`)
            }
        }

        const linkUrl = links[Hydra.apiDocumentation.value].url
        const apiDocUrl = new URL(linkUrl, response.url).toString()
        const responseUrl = new URL(response.url).toString()

        if (responseUrl !== apiDocUrl) {
            let results = [ Result.Success('Api Documentation link found') ]
            if (apiDocUrl !== linkUrl) {
                results.push(Result.Warning('Relative Api Documentation link may not be supported by clients'))
            }

            return {
                results,
                nextChecks: [urlResolveCheck(apiDocUrl, { isApiDoc: true })]
            }
        }

        return {
            result: Result.Informational('Resource is Api Documentation'),
            nextChecks: [analyseRepresentation(response, true)]
        }
    }
}
