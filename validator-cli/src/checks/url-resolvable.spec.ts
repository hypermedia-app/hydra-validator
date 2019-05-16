jest.mock('rdf-fetch')

// @ts-ignore
import * as fetch from 'rdf-fetch'
import check from './url-resolvable'

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
            fetch.mockReturnValue(Promise.resolve(new Response()))
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
        })
    })
})
