import 'isomorphic-fetch'
import check from './api-doc-link'

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
})
