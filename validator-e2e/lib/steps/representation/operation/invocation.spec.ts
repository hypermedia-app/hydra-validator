import { E2eContext } from '../../../../types'
import { InvocationStep } from './invocation'
import { StepStub } from '../../stub'
import * as checkRunner from '../../../checkRunner'
import 'isomorphic-fetch'
import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'

describe('Invoke block', () => {
  let context: E2eContext
  let readFileSync: sinon.SinonStub
  let getResponseRunner: sinon.SinonStub

  beforeEach(() => {
    context = {
      scenarios: [],
      basePath: '/some/path/with/tests',
    }

    sinon.restore()
    readFileSync = sinon.stub()
    getResponseRunner = sinon.stub(checkRunner, 'getResponseRunner')
  })

  it('invokes operation with provided headers', async () => {
    // given
    const step = new InvocationStep({
      body: 'Test',
      headers: {
        'Content-Type': 'text/csv',
        accept: 'application/rdf+xml',
      },
    }, [])
    const operation = {
      invoke: sinon.stub(),
    }

    // when
    const execute = step.getRunner(operation as any)
    await execute.call(context)

    // then
    expect(operation.invoke).to.have.been.calledWith(
      'Test', new Headers({
        'content-type': 'text/csv',
        accept: 'application/rdf+xml',
      }))
  })

  it('invokes operation with default headers', async () => {
    // given
    const step = new InvocationStep({
      body: 'Test',
    }, [])
    const operation = {
      invoke: sinon.stub(),
    }
    context.headers = new Headers({
      'Content-Type': 'text/csv',
      accept: 'application/rdf+xml',
    })

    // when
    const execute = step.getRunner(operation as any)
    await execute.call(context)

    // then
    expect(operation.invoke).to.have.been.calledWith(
      'Test', new Headers({
        'content-type': 'text/csv',
        accept: 'application/rdf+xml',
      }))
  })

  it('invokes operation with default headers merged with invocation headers', async () => {
    // given
    const step = new InvocationStep({
      body: 'Test',
      headers: {
        'User-Agent': 'curl',
        'Content-Type': 'text/csv',
      },
    }, [])
    const operation = {
      invoke: sinon.stub(),
    }
    context.headers = new Headers({
      'Content-Type': 'application/ld+json',
      accept: 'application/rdf+xml',
    })

    // when
    const execute = step.getRunner(operation as any)
    await execute.call(context)

    // then
    expect(operation.invoke).to.have.been.calledWith(
      'Test', new Headers({
        'user-agent': 'curl',
        'content-type': 'text/csv',
        accept: 'application/rdf+xml',
      }))
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
      fs: { readFileSync },
    }, [])
    const operation = {
      invoke: sinon.stub(),
    }

    // when
    const execute = step.getRunner(operation as any)
    await execute.call(context)

    // then
    expect(readFileSync).to.have.been.calledWith('/some/path/body/data.csv')
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
    }, [])
    const operation = {
      invoke: sinon.stub(),
    }
    readFileSync.throws(() => {
      throw new Error('Fail to open file')
    })

    // when
    const execute = step.getRunner(operation as any)
    const { result } = await execute.call(context)

    // then
    expect(result!.status).to.eq('error')
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
      invoke: sinon.stub(),
    }
    const response = {}
    operation.invoke.returns(response)

    // when
    const execute = step.getRunner(operation as any)
    await execute.call(context)

    // then
    expect(getResponseRunner).to.have.been.calledWith(response, step)
  })

  it('invokes operation with empty body when not given', async () => {
    // given
    const step = new InvocationStep({}, [])
    const operation = {
      invoke: sinon.stub(),
    }

    // when
    const execute = step.getRunner(operation as any)
    await execute.call(context)

    // then
    expect(operation.invoke).to.have.been.calledWith('', new Headers({}))
  })
})
