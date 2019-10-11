import { getResponseRunner } from '../../../checkRunner'
import { LinkStep } from './'
import { E2eContext } from '../../../../types'
import { StepStub } from '../../stub'

jest.mock('../../../checkRunner')

describe('link', () => {
    let context: E2eContext & any
    beforeEach(() => {
        context = {
            scenarios: [],
        }
        jest.resetAllMocks()
    })

    it('applies to identified resource', () => {
        // given
        const step = new LinkStep({
            rel: 'self',
            strict: false,
        }, [], [])

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
            }, [], [])
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
            }, [], [])
            const resource = {
                getLinks: () => [],
            }

            // when
            const execute = step.getRunner(resource as any)
            const { result } = await execute.call(context)

            // then
            expect(result!.status).toBe('failure')
        })

        it('when strict and link not found but exists on resource; returns warning, follows link', async () => {
            // given
            const step = new LinkStep({
                rel: 'urn:not:link',
                strict: true,
            }, [], [])
            const linked = { id: 'urn:resource:linked' }
            const resource = {
                getLinks: () => [],
                getArray: jest.fn().mockReturnValue([ linked ]),
                'urn:not:link': linked,
            }

            // when
            const execute = step.getRunner(resource as any)
            const { result } = await execute.call(context)

            // then
            expect(result!.status).toBe('warning')
            expect(getResponseRunner).toHaveBeenCalledWith(linked, step)
        })

        it('when strict and link not found but exists on resource; ignores non-resource values', async () => {
            // given
            const step = new LinkStep({
                rel: 'urn:not:link',
                strict: true,
            }, [], [])
            const linked = { id: 'urn:resource:linked' }
            const resource = {
                getLinks: () => [],
                getArray: jest.fn().mockReturnValue([ 10, 'whatever' ]),
                'urn:not:link': linked,
            }

            // when
            const execute = step.getRunner(resource as any)
            await execute.call(context)

            // then
            expect(getResponseRunner).toHaveBeenCalledTimes(0)
        })

        it('dereferences linked resources when child steps exist', async () => {
            // given
            const step = new LinkStep({
                rel: 'urn:link:rel',
                strict: true,
            }, [], [])
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
            expect(getResponseRunner).toHaveBeenCalledWith({ id: 'urn:resource:one' }, step)
            expect(getResponseRunner).toHaveBeenCalledWith({ id: 'urn:resource:two' }, step)
        })
    })
})
