import { namedNode } from '@rdfjs/data-model'
import { IriTemplate, Resource } from 'alcaeus'
import * as checkRunner from '../../../checkRunner'
import { LinkStep } from './'
import { E2eContext } from '../../../../types'
import { RecursivePartial } from '../../../testHelpers'
import { StepSpy } from '../../stub'
import { StatusStep } from '../../response/status'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import sinon from 'sinon'
import { GraphPointer } from 'clownface'
import { schema } from '@tpluscode/rdf-ns-builders'

describe('link', () => {
  let context: E2eContext & any
  let getResponseRunner: sinon.SinonStub
  let getUrlRunner: sinon.SinonStub

  beforeEach(() => {
    context = {
      scenarios: [],
    }
    sinon.restore()
    getResponseRunner = sinon.stub(checkRunner, 'getResponseRunner')
    getUrlRunner = sinon.stub(checkRunner, 'getUrlRunner')
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
    expect(applies).to.be.ok
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
      expect(result).to.be.undefined
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
      expect(result!.status).to.eq('failure')
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
        getArray: sinon.stub().returns([linked]),
        'urn:not:link': linked,
      }

      // when
      const execute = step.getRunner(resource as any)
      const { result } = await execute.call(context)

      // then
      expect(result!.status).to.eq('warning')
      expect(getResponseRunner).to.have.been.calledWith(linked, step, false)
    })

    it('dereferences linked resources', async () => {
      // given
      const step = new LinkStep({
        rel: 'urn:link:rel',
        strict: true,
      }, [], [])
      const resource: RecursivePartial<Resource> = {
        getLinks: () => [
          {
            supportedProperty: {
              id: namedNode('urn:link:rel'),
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
      expect(nextChecks).to.have.length(2)
      expect(getResponseRunner).to.have.been.calledWith({ id: 'urn:resource:one' }, step, false)
      expect(getResponseRunner).to.have.been.calledWith({ id: 'urn:resource:two' }, step, false)
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
        expand: sinon.stub().returns('filled-in-template'),
      }
      const resource: RecursivePartial<Resource> = {
        getLinks: () => [
          {
            supportedProperty: {
              id: namedNode('urn:link:rel'),
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
      expect(template.expand).to.have.been.calledWithMatch((variables: GraphPointer) => {
        expect(variables.out(schema.tag).values).to.include.all.members(['foo', 'bar'])
        expect(variables.out(schema.title).value).to.eq('baz')
        return true
      })
      expect(getUrlRunner).to.have.been.calledWith('filled-in-template', step, true)
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
        expand: sinon.stub().returns('filled-in-template'),
      }
      const resource: RecursivePartial<Resource> = {
        getLinks: () => [
          {
            supportedProperty: {
              id: namedNode('urn:link:rel'),
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
      expect(template.expand).to.have.been.calledWithMatch((variables: GraphPointer) => {
        expect(variables.out(schema.tag).values).to.include.all.members(['foo', 'bar'])
        expect(variables.out(schema.title).value).to.eq('baz')
        return true
      })
      expect(getUrlRunner).to.have.been.calledWith('filled-in-template', step, false)
    })
  })
})
