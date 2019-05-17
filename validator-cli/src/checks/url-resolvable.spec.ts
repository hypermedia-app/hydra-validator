jest.mock('rdf-fetch')
jest.mock('./response/api-doc-link')
jest.mock('./analyse-representation')

// @ts-ignore
import * as fetch from 'rdf-fetch'
import check from './url-resolvable'
import apiLinkCheck from './response/api-doc-link'
import representationCheck from './analyse-representation'

describe('url-resolvable', () => {
    test('fails when fetch fails', async () => {
    // given
        fetch.mockReturnValue(Promise.reject(new Error()))
        const context = {}

        // when
        const { result } = await check('').call(context)

        // then
        expect(result!.status).toEqual('failure')
    })

    describe('when request succeeds', () => {
        test('returns success', async () => {
            // given
            fetch.mockReturnValue(Promise.resolve({
                dataset: () => {}
            }))
            const context = {}

            // when
            const { result } = await check('').call(context)

            // then
            expect(result!.status).toEqual('success')
        })

        test('does not queue contents check if fetchOnly is true', async () => {
            // given
            fetch.mockReturnValue(Promise.resolve(new Response()))
            const context = {}

            // when
            const { nextChecks } = await check('', { fetchOnly: true }).call(context)

            // then
            expect(nextChecks!.length).toEqual(1)
            expect(nextChecks![0].name).toEqual('statusCode')
        })

        test('does not queue up Link check if apiDoc param is true', async () => {
            // given
            fetch.mockReturnValue(Promise.resolve({
                dataset: () => {}
            }))
            const context = {}

            // when
            await check('', { isApiDoc: true }).call(context)

            // then
            expect(apiLinkCheck).not.toHaveBeenCalled()
        })

        test('queues up Link check if apiDoc param is false', async () => {
            // given
            const response = {
                dataset: () => {}
            }
            fetch.mockReturnValue(Promise.resolve(response))
            const context = {}

            // when
            await check('', { isApiDoc: false }).call(context)

            // then
            expect(apiLinkCheck).toHaveBeenCalledWith(response)
        })

        test('queues up representation check by default', async () => {
            // given
            const response = {
                dataset: jest.fn()
            }
            fetch.mockReturnValue(Promise.resolve(response))
            const context = {}

            // when
            await check('').call(context)

            // then
            expect(representationCheck).toHaveBeenCalledWith(response, false)
        })

        test('queues up representation check when apiDoc param is true', async () => {
            // given
            const response = {
                dataset: jest.fn()
            }
            fetch.mockReturnValue(Promise.resolve(response))
            const context = {}

            // when
            await check('', { isApiDoc: true }).call(context)

            // then
            expect(representationCheck).toHaveBeenCalledWith(response, true)
        })

        beforeEach(() => {
            jest.clearAllMocks()
                .resetModules()
        })
    })
})
