import {checkChain, Result} from '../../check'
// @ts-ignore
import * as parse from 'parse-link-header'
import {Hydra} from '../../namespace'
import urlResolveCheck from '../url-resolvable'

export default function(response: Response): checkChain {
    return function () {
        if (!response.headers.has('link')) {
            return [
                Result.Failure('Link header missing'), []
            ]
        }

        const linkHeaders = response.headers.get('link')
        const links = parse(linkHeaders)

        if (!links[Hydra.apiDocumentation.value]) {
            return [
                Result.Failure(`rel=<${Hydra.apiDocumentation.value}> link not found in the response`)
            ]
        }

        const linkUrl = links[Hydra.apiDocumentation.value].url
        const apiDocUrl = new URL(linkUrl, response.url).toString()

        if (response.url !== apiDocUrl) {
            let result = Result.Success('Api Documentation link found')
            if (apiDocUrl !== linkUrl) {
                result = Result.Warning('Relative Api Documentation link may not be supported by clients')
            }

            return [
                result,
                [urlResolveCheck(apiDocUrl)]
            ]
        }

        return [
            Result.Informational('Resource is Api Documentation')
        ]
    }
}
