import check from './status-code'

test('should pass when status is successful', async () => {
    // given
    const response = {
        ok: true,
        text: () => {}
    } as any

    // when
    const [result] = await check(response)()


    // then
    expect(result.status).toEqual('success')
})

test('should fail when status is not successful', async () => {
    // given
    const response = {
        ok: false
    } as any

    // when
    const [result] = await check(response)()

    // then
    expect(result.status).toEqual('failure')
})
