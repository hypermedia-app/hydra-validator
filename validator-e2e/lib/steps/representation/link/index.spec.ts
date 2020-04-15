import { namedNode } from '@rdfjs/data-model'
import { HydraResource } from 'alcaeus/Resources'
import { getResponseRunner, getUrlRunner } from '../../../checkRunner'
import { LinkStep } from './'
import { E2eContext } from '../../../../types'
import { RecursivePartial } from '../../../testHelpers'
import { IriTemplate } from 'alcaeus/Resources/Mixins/IriTemplate'
import { StepSpy } from '../../stub'
import { StatusStep } from '../../response/status'

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
        getArray: () => [],
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
        id: namedNode('foo'),
        getLinks: () => [],
        getArray: () => [],
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
      expect(getResponseRunner).toHaveBeenCalledWith(linked, step, false)
    })

    it('dereferences linked resources', async () => {
      // given
      const step = new LinkStep({
        rel: 'urn:link:rel',
        strict: true,
      }, [], [])
      const resource: RecursivePartial<HydraResource> = {
        getLinks: () => [
          {
            supportedProperty: {
              property: {
                id: namedNode('urn:link:rel'),
              },
            },
            resources: [
              { id: 'urn:resource:one' },
              { id: 'urn:resource:two' },
            ],
          },
        ],
        getArray: () => [],
      }

      // when
      const execute = step.getRunner(resource as any)
      const { nextChecks } = await execute.call(context)

      // then
      expect(nextChecks).toHaveLength(2)
      expect(getResponseRunner).toHaveBeenCalledWith({ id: 'urn:resource:one' }, step, false)
      expect(getResponseRunner).toHaveBeenCalledWith({ id: 'urn:resource:two' }, step, false)
    })
  })

  describe('block', () => {
    it('dereferences populated template', async () => {
      // given
      const step = new LinkStep({
        rel: 'urn:link:rel',
        strict: false,
        variables: [
          { key: 'http://schema.org/tag', value: 'foo' },
          { key: 'http://schema.org/tag', value: 'bar' },
          { key: 'http://schema.org/title', value: 'baz' },
        ],
      }, [new StepSpy()], [])
      const template: Partial<IriTemplate> = {
        expand: jest.fn().mockReturnValue('filled-in-template'),
      }
      const resource: RecursivePartial<HydraResource> = {
        getLinks: () => [
          {
            supportedProperty: {
              property: {
                id: namedNode('urn:link:rel'),
              },
            },
            resources: [
              template,
            ],
          },
        ],
        getArray: () => [],
      }

      // when
      const execute = step.getRunner(resource as any)
      await execute.call(context)

      // then
      expect(template.expand).toHaveBeenCalledWith({
        'http://schema.org/tag': ['foo', 'bar'],
        'http://schema.org/title': 'baz',
      })
      expect(getUrlRunner).toHaveBeenCalledWith('filled-in-template', step, true)
    })

    it('does not fail child step when they include a StatusStep', async () => {
      // given
      const step = new LinkStep({
        rel: 'urn:link:rel',
        strict: false,
        variables: [
          { key: 'http://schema.org/tag', value: 'foo' },
          { key: 'http://schema.org/tag', value: 'bar' },
          { key: 'http://schema.org/title', value: 'baz' },
        ],
      }, [new StatusStep({ code: 400 })], [])
      const template: Partial<IriTemplate> = {
        expand: jest.fn().mockReturnValue('filled-in-template'),
      }
      const resource: RecursivePartial<HydraResource> = {
        getLinks: () => [
          {
            supportedProperty: {
              property: {
                id: namedNode('urn:link:rel'),
              },
            },
            resources: [
              template,
            ],
          },
        ],
        getArray: () => [],
      }

      // when
      const execute = step.getRunner(resource as any)
      await execute.call(context)

      // then
      expect(template.expand).toHaveBeenCalledWith({
        'http://schema.org/tag': ['foo', 'bar'],
        'http://schema.org/title': 'baz',
      })
      expect(getUrlRunner).toHaveBeenCalledWith('filled-in-template', step, false)
    })
  })
})
