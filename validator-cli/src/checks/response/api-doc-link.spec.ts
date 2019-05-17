jest.mock('../analyse-representation')
jest.mock('../url-resolvable')

import check from './api-doc-link'
import representationCheck from '../analyse-representation'
import urlResolveCheck from '../url-resolvable'

describe('api-doc-link', () => {
    test('Fails when there is no link', async () => {
        // given
        const response = new Response(null, {
            headers: {}
        })
        const context = {}

        // when
        const { result } = await check(response).call(context)

        // then
        expect(result!.status).toEqual('failure')
    })

    test('Fails when there is no api doc link relation', async () => {
        // given
        const response = new Response(null, {
            headers: {
                Link: '<someting>; rel="up"'
            }
        })
        const context = {}

        // when
        const { result } = await check(response).call(context)

        // then
        expect(result!.status).toEqual('failure')
    })

    test('queues api doc checks when link is same as fetched doc', async () => {
        // given
        const response: any = {
            url: 'urn:doc:link',
            headers: new Headers({
                Link: '<urn:doc:link>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"'
            })
        }

        // when
        await check(response).call({})

        // then
        expect(representationCheck).toHaveBeenCalledWith(response, true)
    })

    test('warns if api doc link is relative', async () => {
        // given
        const response: any = {
            url: 'http://example.com/',
            headers: new Headers({
                Link: '</doc>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"'
            })
        }

        // when
        const { results } = await check(response).call({})

        // then
        expect(results!.find(result => result.status === 'warning')).toBeDefined()
    })

    test('queues dereferencing check using doc link when link is relative', async () => {
        // given
        const response: any = {
            url: 'http://example.com/test/resource',
            headers: new Headers({
                Link: '<doc>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"'
            })
        }

        // when
        await check(response).call({})

        // then
        expect(urlResolveCheck).toHaveBeenCalledWith('http://example.com/test/doc', { isApiDoc: true })
    })

    test('queues dereferencing check using doc link', async () => {
        // given
        const response: any = {
            url: 'http://example.com/test/resource',
            headers: new Headers({
                Link: '<http://example.com/doc>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"'
            })
        }

        // when
        await check(response).call({})

        // then
        expect(urlResolveCheck).toHaveBeenCalledWith('http://example.com/doc', { isApiDoc: true })
    })

    test('should keep same level when resource is api doc already', async () => {
        // given
        const response: any = {
            url: 'urn:doc:link',
            headers: new Headers({
                Link: '<urn:doc:link>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"'
            })
        }

        // when
        const { sameLevel } = await check(response).call({})

        // then
        expect(sameLevel).toBeTruthy()
    })
})
