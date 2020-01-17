import { namedNode } from '@rdfjs/data-model'
import { IdentifierStep } from './'
import { E2eContext } from '../../../../types'

jest.mock('../../../checkRunner')

describe('Identifier', () => {
  let context: E2eContext

  it('applies to identified resource', () => {
    // given
    const step = new IdentifierStep({
      value: 'http://foo/bar',
    })

    // when
    const applies = step.appliesTo({
      id: 'whatever',
    } as any)

    // then
    expect(applies).toBeTruthy()
  })

  it('returns success when the resource identifier matches', async () => {
    // given
    const step = new IdentifierStep({
      value: 'http://foo/bar',
    })
    const resource = {
      id: namedNode('http://foo/bar'),
    }

    // when
    const execute = step.getRunner(resource as any)
    const { result } = await execute.call(context)

    // then
    expect(result!.status).toBe('success')
  })

  it('returns failure when the resource has different identifier', async () => {
    // given
    const step = new IdentifierStep({
      value: 'http://foo/bar',
    })
    const resource = {
      id: 'http://something/else',
    }

    // when
    const execute = step.getRunner(resource as any)
    const { result } = await execute.call(context)

    // then
    expect(result!.status).toBe('failure')
  })

  it('returns failure when resource is not an object', async () => {
    // given
    const step = new IdentifierStep({
      value: 'http://foo/bar',
    })
    const resource = 'foo bar'

    // when
    const execute = step.getRunner(resource as any)
    const { result } = await execute.call(context)

    // then
    expect(result!.status).toBe('failure')
  })
})
