import ensureSingleResource from './ensure-single-resource'

describe('api-documentation', () => {
    test('should queue failure when no api doc nodes were found', async () => {
        // given
        const fakeClownface = {
            values: [],
        }

        // when
        const { result } = await ensureSingleResource(fakeClownface).call({})

        // then
        expect(result!.status).toEqual('failure')
    })

    test('should queue failure when multiple api doc nodes were found', async () => {
        // given
        const fakeClownface = {
            values: [1, 2, 3],
        }

        // when
        const { result } = await ensureSingleResource(fakeClownface).call({})

        // then
        expect(result!.status).toEqual('failure')
    })

    test('sets discovered api doc to context', async () => {
        // given
        const fakeClownface = {
            values: ['urn:api:documentation'],
        }

        // when
        const { context } = await ensureSingleResource(fakeClownface).call({})

        // then
        expect(context!.apiDocumentation).toEqual(fakeClownface)
    })
})
