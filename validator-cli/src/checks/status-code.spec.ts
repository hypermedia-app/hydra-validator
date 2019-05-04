import check from './status-code'
import {Maybe} from 'tsmonad';

test('should pass when status is successful', () => {
    // given
    const response = {
        ok: true,
        text: () => {}
    } as any

    // when
    const result = check(Maybe.just(response))
        .caseOf({
            left: () => true,
            right: () => false
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
    const result = check(Maybe.just(response))
        .caseOf({
            left: () => true,
            right: () => false
        })

    // then
    expect(result).toBeFalsy()
})
