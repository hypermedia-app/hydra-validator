import { E2eContext } from '../../../../types'
import { InvocationStep } from './invocation'
import { StepStub } from '../../stub'
import { getResponseRunner } from '../../../checkRunner'
import { readFileSync } from 'fs'

jest.mock('fs')
jest.mock('../../../checkRunner')

describe('Invoke block', () => {
    let context: E2eContext
    beforeEach(() => {
        context = {
            scenarios: [],
            basePath: '/some/path/with/tests',
        }
    })

    it('invokes operation with provided headers', async () => {
        // given
        const step = new InvocationStep({
            body: 'Test',
            headers: {
                'Content-Type': 'text/csv',
                'accept': 'application/rdf+xml',
            },
        }, [ ])
        const operation = {
            invoke: jest.fn(),
        }

        // when
        const execute = step.getRunner(operation as any)
        await execute.call(context)

        // then
        expect(operation.invoke).toHaveBeenCalledWith(
            'Test', {
                'content-type': 'text/csv',
                'accept': 'application/rdf+xml',
            })
    })

    it('resolves relative path for referenced body', async () => {
        // given
        const step = new InvocationStep({
            body: {
                path: '../../body/data.csv',
            },
            headers: {
                'Content-Type': 'text/csv',
            },
        }, [ ])
        const operation = {
            invoke: jest.fn(),
        }

        // when
        const execute = step.getRunner(operation as any)
        await execute.call(context)

        // then
        expect(readFileSync).toHaveBeenCalledWith('/some/path/body/data.csv')
    })

    it('returns error when body file fails to load', async () => {
        // given
        const step = new InvocationStep({
            body: {
                path: '../../body/data.csv',
            },
            headers: {
                'Content-Type': 'text/csv',
            },
        }, [ ])
        const operation = {
            invoke: jest.fn(),
        }
        ;(readFileSync as any).mockImplementationOnce(() => {
            throw new Error('Fail to open file')
        })

        // when
        const execute = step.getRunner(operation as any)
        const { result } = await execute.call(context)

        // then
        expect(result!.status).toBe('error')
    })

    it('enqueues child steps and top level steps', async () => {
        // given
        const step = new InvocationStep({
            body: 'Test',
            headers: {
                'Content-Type': 'text/csv',
            },
        }, [
            new StepStub('child'),
        ])
        const operation = {
            invoke: jest.fn(),
        }
        const response = {}
        operation.invoke.mockReturnValue(response)

        // when
        const execute = step.getRunner(operation as any)
        await execute.call(context)

        // then
        expect(getResponseRunner).toHaveBeenCalledWith(response, step)
    })

    it('invokes operation with empty body when not given', async () => {
        // given
        const step = new InvocationStep({}, [ ])
        const operation = {
            invoke: jest.fn(),
        }

        // when
        const execute = step.getRunner(operation as any)
        await execute.call(context)

        // then
        expect(operation.invoke).toHaveBeenCalledWith('', {})
    })
})
