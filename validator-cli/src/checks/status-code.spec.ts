import check from './status-code'

test('should pass when status is successful', () => {
    // given
    const response = {
        ok: true
    } as any

    // when
    const result = check(response, true)
        .caseOf({
            writer: (story, value) => value
        })


    // then
    expect(result).toBeTruthy()
})

test('should fail when status is not successful', () => {
    // given
    const response = {
        ok: false
    } as any

    // when
    const result = check(response, true)
        .caseOf({
            writer: (story, value) => value
        })

    // then
    expect(result).toBeTruthy()
})
