import runChecks from './run-checks'
import { checkChain, Result } from '.'

async function getResults<T> (iter: AsyncIterableIterator<T>) {
    const results: T[] = []

    for await (const result of iter) {
        results.push(result)
    }

    return results
}

describe('run-checks', () => {
    test('yields an initial informational message', async () => {
        // given
        const check: checkChain = () => ({})

        // when
        const [ first ] = await getResults(runChecks(check))

        // expect
        expect(first.level).toBe(0)
        expect(first.result.status).toBe('informational')
    })

    test('passes same context between subsequent steps', async () => {
        // given
        const secondCheck = jest.fn().mockResolvedValue({})
        const firstCheck = jest.fn().mockResolvedValue({
            nextChecks: [secondCheck],
        })

        // when
        await getResults(runChecks(firstCheck))

        // then
        expect(firstCheck.mock.instances[0]).toBe(secondCheck.mock.instances[0])
    })

    test('recursively calls all queued nextChecks', async () => {
        // given
        const spy = jest.fn().mockResolvedValue({})
        const firstCheck = jest.fn().mockResolvedValue({
            nextChecks: [
                ...[1, 2, 3, 4, 5].map(() => spy),
                jest.fn().mockResolvedValue({
                    nextChecks: [ spy ],
                }),
            ],
        })

        // when
        await getResults(runChecks(firstCheck))

        // then
        expect(spy.mock.calls.length).toBe(6)
    })

    test('yields single result before multiple results', async () => {
        // given
        const firstCheck = jest.fn().mockResolvedValue({
            result: Result.Success('test'),
            results: [
                Result.Success('test'),
                Result.Success('test'),
            ],
        })

        // when
        const results = await getResults(runChecks(firstCheck))

        // then
        expect(results.length).toBe(5)
    })

    test('yields multiple results when result is not provided', async () => {
        // given
        const firstCheck = jest.fn().mockResolvedValue({
            results: [
                Result.Success('test'),
                Result.Success('test'),
            ],
        })

        // when
        const results = await getResults(runChecks(firstCheck))

        // then
        expect(results.length).toBe(4)
    })

    test('yields failure summary when any check fails', async () => {
        // given
        const firstCheck = jest.fn().mockResolvedValue({
            results: [
                Result.Success('test'),
                Result.Failure('test', 'test'),
            ],
        })

        // when
        const results = await getResults(runChecks(firstCheck))

        // then
        expect(results.pop()!.result.status).toBe('failure')
    })

    test('yields success summary when all check succeed', async () => {
        // given
        const firstCheck = jest.fn().mockResolvedValue({
            results: [
                Result.Success('test'),
                Result.Success('test'),
            ],
        })

        // when
        const results = await getResults(runChecks(firstCheck))

        // then
        expect(results.pop()!.result.status).toBe('success')
    })

    test('yields warning summary when any check fails', async () => {
        // given
        const firstCheck = jest.fn().mockResolvedValue({
            results: [
                Result.Success('test'),
                Result.Warning('test'),
            ],
        })

        // when
        const results = await getResults(runChecks(firstCheck))

        // then
        expect(results.pop()!.result.status).toBe('warning')
    })

    test('bumps level for nextCheck', async () => {
        // given
        const spy = jest.fn().mockResolvedValue({
            result: Result.Success('test'),
        })
        const firstCheck = jest.fn().mockResolvedValue({
            result: Result.Success('test'),
            nextChecks: [ spy ],
        })

        // when
        const results = await getResults(runChecks(firstCheck))

        // then
        expect(results[2].level).toBe(1)
    })

    test('does not bump level for nextCheck when sameLevel is true', async () => {
        // given
        const spy = jest.fn().mockResolvedValue({
            result: Result.Success('test'),
        })
        const firstCheck = jest.fn().mockResolvedValue({
            result: Result.Success('test'),
            nextChecks: [ spy ],
            sameLevel: true,
        })

        // when
        const results = await getResults(runChecks(firstCheck))

        // then
        expect(results[2].level).toBe(0)
    })

    test('yields error when a check throws', async () => {
        // given
        const firstCheck = jest.fn().mockImplementation(() => {
            throw new Error('Check failed catastrophically')
        })

        // when
        const results = await getResults(runChecks(firstCheck, fetch))

        // then
        const { result } = results[1] as any
        expect(result.status).toBe('error')
        expect(result.details.message).toBe('Check failed catastrophically')
    })

    test('keeps same level when a check throws', async () => {
        // given
        const throwingCheck = jest.fn().mockImplementation(() => {
            throw new Error('Check failed catastrophically')
        })
        const secondCheck = jest.fn().mockResolvedValue({
            result: Result.Success('second'),
            nextChecks: [throwingCheck],
        })
        const firstCheck = jest.fn().mockResolvedValue({
            result: Result.Success('first'),
            nextChecks: [secondCheck],
        })

        // when
        const results = await getResults(runChecks(firstCheck, fetch))

        // then
        const { level } = results[2]!
        expect(level).toBe(1)
    })
})
