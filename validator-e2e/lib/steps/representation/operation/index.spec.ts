import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { blankNode, namedNode } from '@rdf-esm/data-model'
import { E2eContext } from '../../../../types'
import { OperationStep } from './index'
import { StepStub } from '../../stub'
import { runAll } from '../../../testHelpers'

describe('Operation block', () => {
  let context: E2eContext & any
  beforeEach(() => {
    context = {
      scenarios: [],
    }
  })

  it('when strict and operation is not found returns failure', async () => {
    // given
    const operationStep = new OperationStep({
      strict: true,
      operationId: 'not-found',
    }, [])
    const resource = {
      operations: [],
    }

    // when
    const execute = operationStep.getRunner(resource as any)
    const result = await execute.call(context)

    // then
    expect(result.result!.status).to.eq('failure')
  })

  it('when not strict and operation is not found returns no result', async () => {
    // given
    const operationStep = new OperationStep({
      strict: false,
      operationId: 'not-found',
    }, [])
    const resource = {
      operations: [],
    }

    // when
    const execute = operationStep.getRunner(resource as any)
    const result = await execute.call(context)

    // then
    expect(result.result).to.be.undefined
  })

  it('returns informational when operation is found matching SupportedOperation id', async () => {
    // given
    const operationStep = new OperationStep({
      strict: true,
      operationId: 'the-operation',
    }, [])
    const resource: any = {
      operations: [
        {
          id: namedNode('the-operation'),
        },
      ],
    }

    // when
    const execute = operationStep.getRunner(resource)
    const result = await execute.call(context)

    // then
    expect(result.result!.status).to.eq('informational')
  })

  it('returns informational when operation is found matching Operation type', async () => {
    // given
    const operationStep = new OperationStep({
      strict: true,
      operationId: 'the-operation',
    }, [])
    const resource: any = {
      operations: [
        {
          id: blankNode(),
          types: {
            has: () => true,
          },
        },
      ],
    }

    // when
    const execute = operationStep.getRunner(resource)
    const result = await execute.call(context)

    // then
    expect(result.result!.status).to.eq('informational')
  })

  it('enqueues top-level steps', async () => {
    // given
    const operation = {}
    const operationStep = new OperationStep({
      strict: true,
      operationId: 'the-operation',
    }, [])
    const resource = {
      operations: {
        find: () => operation,
      },
    }
    context.scenarios.push(new StepStub('topLevel'))

    // when
    const execute = operationStep.getRunner(resource as any)
    const result = await runAll(execute, context)

    // then
    expect(result.checkNames).to.include('topLevel')
  })

  it('enqueues child steps before top-level steps', async () => {
    // given
    const operation = {}
    const operationStep = new OperationStep({
      strict: true,
      operationId: 'the-operation',
    }, [
      new StepStub('child'),
    ])
    const resource = {
      operations: {
        find: () => operation,
      },
    }
    context.scenarios.push(new StepStub('topLevel'))

    // when
    const execute = operationStep.getRunner(resource as any)
    const result = await runAll(execute, context)

    // then
    expect(result.checkNames).to.include('child')
    expect(result.checkNames).to.include('topLevel')
    expect(result.checkNames.indexOf('child')).to.be.lessThan(result.checkNames.indexOf('topLevel'))
  })
})
