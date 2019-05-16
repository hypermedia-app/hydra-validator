import 'isomorphic-fetch'
import check from './status-code'

test('should pass when status is successful', async () => {
    // given
    const response = new Response(null, {
        status: 200
    })

    // when
    const { message } = await check(response).call({})

    // then
    expect(message!.status).toEqual('success')
})

test('should fail when status is not successful', async () => {
    // given
    const response = new Response(null, {
        status: 404
    })

    // when
    const { message } = await check(response).call({})

    // then
    expect(message!.status).toEqual('failure')
})
