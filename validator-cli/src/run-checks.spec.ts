import runChecks from './run-checks'
import { checkChain, Result } from './check'

async function getResults<T> (iter: AsyncIterableIterator<T>) {
    const results: T[] = []

    for await (const result of iter) {
        results.push(result)
    }

    return results
}

describe('run-checks', () => {
    const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> = jest.fn()

    test('yields an initial informational message', async () => {
        // given
        const check: checkChain = () => ({})

        // when
        const [ first ] = await getResults(runChecks(check, fetch))

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
        await getResults(runChecks(firstCheck, fetch))

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
        await getResults(runChecks(firstCheck, fetch))

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
        const results = await getResults(runChecks(firstCheck, fetch))

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
        const results = await getResults(runChecks(firstCheck, fetch))

        // then
        expect(results.length).toBe(4)
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
        const results = await getResults(runChecks(firstCheck, fetch))

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
        const results = await getResults(runChecks(firstCheck, fetch))

        // then
        expect(results[2].level).toBe(0)
    })
})
