import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { StatusStep } from './status'
import { E2eContext } from '../../../types'
import 'isomorphic-fetch'

describe('status statement', () => {
  let context: E2eContext & any

  beforeEach(() => {
    context = {
      scenarios: [],
    }
  })

  it('returns success when status code matches that expected', async () => {
    // given
    const step = new StatusStep({
      code: 204,
    })
    const response = new Response(null, {
      status: 204,
    })

    // when
    const execute = step.getRunner(response)
    const result = execute.call(context)

    // then
    expect(result.result!.status).to.eq('success')
  })

  it('returns failure when status code does not match', async () => {
    // given
    const step = new StatusStep({
      code: 404,
    })
    const response = new Response(null, {
      status: 204,
    })

    // when
    const execute = step.getRunner(response)
    const result = execute.call(context)

    // then
    expect(result.result!.status).to.eq('failure')
  })

  it('returns error when status code is not given', async () => {
    // given
    const step = new StatusStep({
      code: null,
    } as any)
    const response = new Response(null, {
      status: 204,
    })

    // when
    const execute = step.getRunner(response)
    const result = execute.call(context)

    // then
    expect(result.result!.status).to.eq('error')
  })

  it('returns error when status code is not a number', async () => {
    // given
    const step = new StatusStep({
      code: 'xyz',
    } as any)
    const response = new Response(null, {
      status: 204,
    })

    // when
    const execute = step.getRunner(response)
    const result = execute.call(context)

    // then
    expect(result.result!.status).to.eq('error')
  })

  it('returns error when status code is not a valid number', async () => {
    // given
    const step = new StatusStep({
      code: '699',
    } as any)
    const response = new Response(null, {
      status: 204,
    })

    // when
    const execute = step.getRunner(response)
    const result = execute.call(context)

    // then
    expect(result.result!.status).to.eq('error')
  })
})
