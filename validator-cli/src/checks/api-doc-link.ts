import {checkChain, Result} from '../check'
// @ts-ignore
import * as parse from 'parse-link-header'
import {Hydra} from '../namespace'
import urlResolveCheck from './url-resolvable'

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
                Result.Failure(`rel=<${Hydra.apiDocumentation.value}> link not found in the response`), []
            ]
        }

        const apiDocUrl = links[Hydra.apiDocumentation.value].url

        if (response.url !== apiDocUrl) {
            return [
                Result.Success('Api Documentation link found'),
                [urlResolveCheck(apiDocUrl)]
            ]
        }

        return [
            Result.Success('Resource is Api Documentation'),
            []
        ]
    }
}
