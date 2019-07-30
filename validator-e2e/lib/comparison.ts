export default function areEqual (expected: unknown, actual: any) {
    if (typeof expected === 'boolean') {
        return expected.toString() === actual.toString()
    }

    // eslint-disable-next-line eqeqeq
    return expected == actual
}
