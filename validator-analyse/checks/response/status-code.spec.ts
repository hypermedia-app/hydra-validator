import 'isomorphic-fetch'
import check from './status-code'

describe('status-code', () => {
  test('should pass when status is successful', async () => {
    // given
    const response = new Response(null, {
      status: 200,
    })
    const context = {}

    // when
    const { result } = await check(response).call(context)

    // then
    expect(result!.status).toEqual('success')
  })

  test('should fail when status is not successful', async () => {
    // given
    const response = new Response(null, {
      status: 404,
    })
    const context = {}

    // when
    const { result } = await check(response).call(context)

    // then
    expect(result!.status).toEqual('failure')
  })
})
