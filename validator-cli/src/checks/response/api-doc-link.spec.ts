import 'isomorphic-fetch'
import check from './api-doc-link'

test('Fails when there is no link', async () => {
    // given
    const response = new Response(null, {
        headers: {}
    })

    // when
    const {message} = await check(response).call({})

    // then
    expect(message!.status).toEqual('failure')
})
