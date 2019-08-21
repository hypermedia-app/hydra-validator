import { getResponseRunner } from '../../../processResponse'
import { LinkStep } from './'
import { E2eContext } from '../../../../types'

jest.mock('../../../processResponse')

describe('link', () => {
    let context: E2eContext & any
    beforeEach(() => {
        context = {
            scenarios: [],
        }
    })

    it('applies to identified resource', () => {
        // given
        const step = new LinkStep({
            rel: 'self',
            strict: false,
        }, [])

        // when
        const applies = step.appliesTo({
            id: 'whatever',
        } as any)

        // then
        expect(applies).toBeTruthy()
    })

    describe('statement', () => {
        it('when not strict and link not found, returns no result', async () => {
            // given
            const step = new LinkStep({
                rel: 'self',
                strict: false,
            }, [])
            const resource = {
                getLinks: () => [],
            }

            // when
            const execute = step.getRunner(resource as any)
            const { result } = await execute.call(context)

            // then
            expect(result).toBeUndefined()
        })

        it('when strict and link not found, returns failure', async () => {
            // given
            const step = new LinkStep({
                rel: 'self',
                strict: true,
            }, [])
            const resource = {
                getLinks: () => [],
            }

            // when
            const execute = step.getRunner(resource as any)
            const { result } = await execute.call(context)

            // then
            expect(result!.status).toBe('failure')
        })

        it('follows all links', async () => {
            // given
            const step = new LinkStep({
                rel: 'urn:link:rel',
                strict: true,
            }, [])
            const resource = {
                getLinks: () => [
                    {
                        supportedProperty: {
                            property: {
                                id: 'urn:link:rel',
                            },
                        },
                        resources: [
                            { id: 'urn:resource:one' },
                            { id: 'urn:resource:two' },
                        ],
                    },
                ],
            }

            // when
            const execute = step.getRunner(resource as any)
            const { nextChecks } = await execute.call(context)

            // then
            expect(nextChecks).toHaveLength(2)
            expect(getResponseRunner).toHaveBeenCalledWith('urn:resource:one', [])
            expect(getResponseRunner).toHaveBeenCalledWith('urn:resource:two', [])
        })
    })
})
