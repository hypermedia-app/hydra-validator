import areEqual from './comparison'

describe('areEqual', () => {
    const equalPairs = [
        [0, 0],
        [0, '0'],
        ['0', '0'],
        [false, false],
        [false, 'false'],
        [true, 'true'],
        ['foo', 'foo'],
    ]

    equalPairs.forEach(pair => {
        it(`${typeof pair[0]} ${pair[0]} should equal ${typeof pair[1]} ${pair[1]}`, () => {
            expect(areEqual(pair[0], pair[1])).toBeTruthy()
        })
    })

    const unequalPairs = [
        [0, 1],
        [0, '1'],
        [false, true],
        [false, 'true'],
        [true, 'false'],
        ['foo', 'bar'],
    ]

    unequalPairs.forEach(pair => {
        it(`${typeof pair[0]} ${pair[0]} should not equal ${typeof pair[1]} ${pair[1]}`, () => {
            expect(areEqual(pair[0], pair[1])).toBeFalsy()
        })
    })
})
