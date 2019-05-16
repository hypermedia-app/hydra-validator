import apiDocChecks from './index'

describe('api-documentation', () => {
    test('should queue failure when no api doc nodes were found', async () => {
        // given
        const fakeClownface = {
            values: []
        }

        // when
        const checkQueued = apiDocChecks(fakeClownface)

        // then
        expect(checkQueued.length).toEqual(1)
        expect((await checkQueued[0]()).result!.status).toEqual('failure')
    })

    test('should queue failure when multiple api doc nodes were found', async () => {
        // given
        const fakeClownface = {
            values: [1, 2, 3]
        }

        // when
        const checkQueued = apiDocChecks(fakeClownface)

        // then
        expect(checkQueued.length).toEqual(1)
        expect((await checkQueued[0]()).result!.status).toEqual('failure')
    })
})
