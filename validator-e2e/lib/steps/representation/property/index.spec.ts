import { PropertyStep } from '.'
import { E2eContext } from '../../../../types'
import { StepStub } from '../../stub'
import { expand } from '@zazuko/rdf-vocabularies'

describe('property step', () => {
    let context: E2eContext & any
    beforeEach(() => {
        context = {
            scenarios: [],
        }
    })

    it('returns error when step has both children and value', async () => {
        // given
        const propertyStatement = new PropertyStep({
            propertyId: 'title',
            value: 'foo',
            strict: false,
        }, [ {} as any ])

        // when
        const execute = propertyStatement.getRunner({} as any)
        const result = await execute.call(context)

        // then
        expect(result.result!.status).toBe('error')
    })

    it('applies to hydra resource', () => {
        // given
        const propertyStatement = new PropertyStep({
            propertyId: 'title',
            value: 'foo',
            strict: false,
        }, [ ])

        // when
        const result = propertyStatement.appliesTo({
            id: 'id',
        })

        // then
        expect(result).toBe(true)
    })

    describe('statement', () => {
        it('returns failure when values do not match', async () => {
            // given
            const propertyStatement = new PropertyStep({
                propertyId: 'title',
                value: 'foo',
                strict: false,
            }, [])
            const value: any = {
                title: 'bar',
            }

            // when
            const execute = propertyStatement.getRunner(value)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('failure')
        })

        it('returns success when values not match', async () => {
            // given
            const propertyStatement = new PropertyStep({
                propertyId: 'title',
                value: 'foo',
                strict: false,
            }, [])
            const value: any = {
                title: 'foo',
            }

            // when
            const execute = propertyStatement.getRunner(value)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('success')
        })

        it('returns failure when strict and property is missing', async () => {
            // given
            const propertyStatement = new PropertyStep({
                propertyId: 'title',
                value: 'foo',
                strict: true,
            }, [])
            const value: any = {
            }

            // when
            const execute = propertyStatement.getRunner(value)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('failure')
        })

        it('returns informational when not strict and property is missing', async () => {
            // given
            const propertyStatement = new PropertyStep({
                propertyId: 'title',
                strict: false,
            }, [])
            const value: any = {}

            // when
            const execute = propertyStatement.getRunner(value)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('informational')
        })

        it('returns success when comparing resource has expected rdf:type', async () => {
            // given
            const propertyStatement = new PropertyStep({
                propertyId: expand('rdf:type'),
                value: 'http://example.com/Class',
                strict: true,
            }, [])
            const value = {
                types: {
                    contains: () => true,
                },
            }

            // when
            const execute = propertyStatement.getRunner(value as any)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('success')
        })

        it('returns success when resource does not have expected rdf:type', async () => {
            // given
            const propertyStatement = new PropertyStep({
                propertyId: expand('rdf:type'),
                value: 'http://example.com/Class',
                strict: true,
            }, [])
            const value = {
                types: {
                    contains: () => false,
                },
            }

            // when
            const execute = propertyStatement.getRunner(value as any)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('failure')
        })

        it('returns error when rdf:type statement is not strict', async () => {
            // given
            const propertyStatement = new PropertyStep({
                propertyId: expand('rdf:type'),
                value: 'http://example.com/Class',
                strict: false,
            }, [])
            const value = {
                types: {
                    contains: () => false,
                },
            }

            // when
            const execute = propertyStatement.getRunner(value as any)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('error')
        })
    })

    describe('block', () => {
        it('returns failure when strict and property is missing', async () => {
            // given
            const propertyBlock = new PropertyStep({
                propertyId: 'title',
                strict: true,
            }, [])
            const value: any = {}

            // when
            const execute = propertyBlock.getRunner(value)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('failure')
        })

        it('returns informational when not strict and property is missing', async () => {
            // given
            const propertyBlock = new PropertyStep({
                propertyId: 'title',
                strict: false,
            }, [])
            const value: any = {}

            // when
            const execute = propertyBlock.getRunner(value)
            const result = await execute.call(context)

            // then
            expect(result.result!.status).toBe('informational')
        })

        it('enqueues child steps and top-level steps in that order', async () => {
            // given
            const childSteps = [
                new StepStub('step1'),
                new StepStub('step2'),
            ]
            context.scenarios.push(new StepStub('topLevel1'))
            context.scenarios.push(new StepStub('topLevel2'))
            const propertyBlock = new PropertyStep({
                propertyId: 'title',
                strict: false,
            }, childSteps)

            // when
            const execute = propertyBlock.getRunner({ title: 'hello' } as any)
            const result = await execute.call(context)

            // then
            expect(result.nextChecks!.map(check => check.name).join(', '))
                .toBe('step1, step2, topLevel1, topLevel2')
        })
    })
})
