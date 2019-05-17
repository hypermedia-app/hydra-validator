jest.mock('rdf-fetch')
jest.mock('./response/api-doc-link')
jest.mock('./analyse-representation')

// @ts-ignore
import * as fetch from 'rdf-fetch'
import check from './url-resolvable'
import apiLinkCheck from './response/api-doc-link'
import representationCheck from './analyse-representation'

function testContext (visitedUrls: string[] = []) {
    return {
        visitedUrls
    }
}

describe('url-resolvable', () => {
    test('does not append to visitedUrls when URL is already present', async () => {
        // given
        const response = {
            dataset: jest.fn()
        }
        fetch.mockReturnValue(Promise.resolve(response))
        const inputContext = testContext(['http://exmaple.com/'])

        // when
        const { context } = await check('http://exmaple.com/').call(inputContext)

        // then
        expect(context!.visitedUrls.length).toEqual(1)
    })

    test('returns informational when URL has already been visited', async () => {
        // given
        const inputContext = testContext(['urn:already:seen'])

        // when
        const { result, nextChecks } = await check('urn:already:seen').call(inputContext)

        // then
        expect(result!.status).toEqual('informational')
        expect(nextChecks).toBeUndefined()
    })

    describe('when fetch fails', () => {
        test('returns failure', async () => {
            // given
            fetch.mockReturnValue(Promise.reject(new Error()))

            // when
            const { result } = await check('https://example.com').call(testContext())

            // then
            expect(result!.status).toEqual('failure')
        })

        test('appends url to visitedUrls', async () => {
            // given
            fetch.mockReturnValue(Promise.reject(new Error()))

            // when
            const { context } = await check('https://example.com').call(testContext())

            // then
            expect(context!.visitedUrls).toContain('https://example.com/')
        })
    })

    describe('when request succeeds', () => {
        test('returns success', async () => {
            // given
            fetch.mockReturnValue(Promise.resolve({
                dataset: () => {
                }
            }))

            // when
            const { result } = await check('https://example.com').call(testContext())

            // then
            expect(result!.status).toEqual('success')
        })

        test('does not queue contents check if fetchOnly is true', async () => {
            // given
            fetch.mockReturnValue(Promise.resolve(new Response()))

            // when
            const { nextChecks } = await check('https://example.com', { fetchOnly: true }).call(testContext())

            // then
            expect(nextChecks!.length).toEqual(1)
            expect(nextChecks![0].name).toEqual('statusCode')
        })

        test('does not queue up Link check if apiDoc param is true', async () => {
            // given
            fetch.mockReturnValue(Promise.resolve({
                url: 'https://example.com',
                dataset: () => {
                }
            }))

            // when
            await check('https://example.com', { isApiDoc: true }).call(testContext())

            // then
            expect(apiLinkCheck).not.toHaveBeenCalled()
        })

        test('queues up Link check if apiDoc param is false', async () => {
            // given
            const response = {
                dataset: () => {
                }
            }
            fetch.mockReturnValue(Promise.resolve(response))

            // when
            await check('https://example.com', { isApiDoc: false }).call(testContext())

            // then
            expect(apiLinkCheck).toHaveBeenCalledWith(response)
        })

        test('queues up representation check by default', async () => {
            // given
            const response = {
                dataset: jest.fn()
            }
            fetch.mockReturnValue(Promise.resolve(response))

            // when
            await check('https://example.com').call(testContext())

            // then
            expect(representationCheck).toHaveBeenCalledWith(response, false)
        })

        test('queues up representation check when apiDoc param is true', async () => {
            // given
            const response = {
                dataset: jest.fn()
            }
            fetch.mockReturnValue(Promise.resolve(response))

            // when
            await check('https://example.com', { isApiDoc: true }).call(testContext())

            // then
            expect(representationCheck).toHaveBeenCalledWith(response, true)
        })

        test('appends url to visitedUrls', async () => {
            // given
            const response = {
                dataset: jest.fn()
            }
            fetch.mockReturnValue(Promise.resolve(response))

            // when
            const { context } = await check('https://example.com').call(testContext())

            // then
            expect(context!.visitedUrls).toContain('https://example.com/')
        })

        beforeEach(() => {
            jest.clearAllMocks()
                .resetModules()
        })
    })
})
