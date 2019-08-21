jest.mock('@rdfjs/fetch-lite')
jest.mock('./response/api-doc-link')
jest.mock('./analyse-representation')

// @ts-ignore
import fetch from '@rdfjs/fetch-lite'
import check from './url-resolvable'
import apiLinkCheck from './response/api-doc-link'
import representationCheck from './analyse-representation'

function testContext (visitedUrls: string[] = []) {
    return {
        visitedUrls,
    }
}

describe('url-resolvable', () => {
    test('does not append to visitedUrls when URL is already present', async () => {
        // given
        const response = {
            dataset: jest.fn(),
        }
        fetch.mockResolvedValue(response)
        const context = testContext(['http://exmaple.com/'])

        // when
        await check('http://exmaple.com/').call(context)

        // then
        expect(context.visitedUrls.length).toEqual(1)
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
            fetch.mockRejectedValue(new Error())

            // when
            const { result } = await check('https://example.com').call(testContext())

            // then
            expect(result!.status).toEqual('failure')
        })

        test('appends url to visitedUrls', async () => {
            // given
            fetch.mockRejectedValue(new Error())
            const context = testContext()

            // when
            await check('https://example.com').call(context)

            // then
            expect(context.visitedUrls).toContain('https://example.com/')
        })
    })

    describe('when request succeeds', () => {
        test('returns success', async () => {
            // given
            fetch.mockResolvedValue({
                dataset: () => {
                },
            })

            // when
            const { result } = await check('https://example.com').call(testContext())

            // then
            expect(result!.status).toEqual('success')
        })

        test('does not queue contents check if fetchOnly is true', async () => {
            // given
            fetch.mockResolvedValue(new Response())

            // when
            const { nextChecks } = await check('https://example.com', { fetchOnly: true }).call(testContext())

            // then
            expect(nextChecks!.length).toEqual(1)
            expect(nextChecks![0].name).toEqual('statusCode')
        })

        test('does not queue up Link check if apiDoc param is true', async () => {
            // given
            fetch.mockResolvedValue({
                url: 'https://example.com',
                dataset: () => {
                },
            })

            // when
            await check('https://example.com', { isApiDoc: true }).call(testContext())

            // then
            expect(apiLinkCheck).not.toHaveBeenCalled()
        })

        test('queues up Link check if apiDoc param is false', async () => {
            // given
            const response = {
                dataset: () => {
                },
            }
            fetch.mockResolvedValue(response)

            // when
            await check('https://example.com', { isApiDoc: false }).call(testContext())

            // then
            expect(apiLinkCheck).toHaveBeenCalledWith(response)
        })

        test('queues up representation check when apiDoc param is true', async () => {
            // given
            const response = {
                dataset: jest.fn(),
            }
            fetch.mockResolvedValue(response)

            // when
            await check('https://example.com', { isApiDoc: true }).call(testContext())

            // then
            expect(representationCheck).toHaveBeenCalledWith(response, true)
        })

        test('appends url to visitedUrls', async () => {
            // given
            const response = {
                dataset: jest.fn(),
            }
            fetch.mockResolvedValue(response)
            const context = testContext()

            // when
            await check('https://example.com').call(context)

            // then
            expect(context!.visitedUrls).toContain('https://example.com/')
        })

        beforeEach(() => {
            jest.clearAllMocks()
                .resetModules()
        })
    })
})
