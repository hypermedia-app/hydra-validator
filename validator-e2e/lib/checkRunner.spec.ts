import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { Resource, HydraResponse } from 'alcaeus'
import sinon from 'sinon'
import { Hydra } from 'alcaeus/node'
import { namedNode } from '@rdfjs/data-model'
import { RdfResource } from '@tpluscode/rdfine'
import { getResponseRunner, getResourceRunner, getUrlRunner } from './checkRunner'
import { E2eContext } from '../types'
import { ScenarioStep } from './steps'
import { ConstraintMock, StepSpy, StepStub } from './steps/stub'
import { runAll } from './testHelpers'

describe('processResponse', () => {
  let context: E2eContext
  let loadResource: sinon.SinonStub

  beforeEach(() => {
    context = {
      basePath: '',
      scenarios: [],
    }

    sinon.restore()
    loadResource = sinon.stub(Hydra, 'loadResource')
  })

  describe('url runner', () => {
    it('fetches representation with alcaeus', async () => {
      // given
      const step: ScenarioStep = {
        children: [],
        constraints: [],
      } as any
      const runner = getUrlRunner('urn:resource:id', step)
      loadResource.resolves({
        xhr: {
          url: 'x:y:z',
        },
      })

      // when
      await runner.call(context)

      // then
      expect(loadResource).to.have.been.calledWith('urn:resource:id')
    })

    it('passes default headers to request', async () => {
      // given
      const step: ScenarioStep = {
        children: [],
        constraints: [],
      } as any
      const runner = getUrlRunner('urn:resource:id', step)
      loadResource.resolves({
        xhr: {
          url: 'x:y:z',
        },
      })
      const headersInit = new Headers({
        Authorization: 'Bearer jwt',
      })
      context.headers = headersInit

      // when
      await runner.call(context)

      // then
      expect(loadResource).to.have.been.calledWith('urn:resource:id', headersInit)
    })

    it('fails when request fails', async () => {
      // given
      loadResource.rejects(new Error('Failed to dereference link'))
      const runner = getUrlRunner('urn:resource:id', new StepStub('ignored'))

      // when
      const { result } = await runner.call(context)

      // then
      expect(result!.status).to.eq('error')
    })

    it('can fail fast when request is not successful', async () => {
      // given
      loadResource.resolves({
        response: {
          xhr: {
            ok: false,
            status: 404,
            statusText: 'Not Found',
          },
        },
      })
      const runner = getUrlRunner('urn:resource:id', new StepStub('ignored'), true)

      // when
      const { result } = await runner.call(context)

      // then
      expect(result!.status).to.eq('failure')
    })
  })

  describe('response runner', () => {
    it('fails when the parameter is undefined', async () => {
      // given
      const step: ScenarioStep = {
        children: [],
        constraints: [],
      } as any
      const runner = getResponseRunner(undefined as any, step)

      // when
      const { result } = await runner.call(context)

      // then
      expect(result!.status).to.eq('failure')
    })

    it('fails when the parameter is a literal', async () => {
      // given
      const step: ScenarioStep = {
        children: [],
        constraints: [],
      } as any
      const runner = getResponseRunner('not a link somehow' as any, step)

      // when
      const { result } = await runner.call(context)

      // then
      expect(result!.status).to.eq('failure')
    })

    it('dereferences a resource', async () => {
      // given
      const step: ScenarioStep = {
        children: [],
        constraints: [],
      } as any
      const resource: Partial<RdfResource> = {
        id: namedNode('foo'),
      }
      loadResource.resolves({
        xhr: {
          url: 'x:y:z',
        },
      })
      const runner = getResponseRunner(resource as any, step)

      // when
      await runner.call(context)

      // then
      expect(Hydra.loadResource).to.have.been.calledWith('foo')
    })

    it('does not perform request when passed a response object', async () => {
      // given
      const step: ScenarioStep = {
        children: [],
        constraints: [],
      } as any
      const response: HydraResponse = {
        xhr: { url: 'foo' },
      } as any
      const runner = getResponseRunner(response, step)

      // when
      await runner.call(context)

      // then
      expect(Hydra.loadResource).not.to.have.been.called
    })

    it('runs steps on representation', async () => {
      // given
      const spy = new StepSpy()
      const step: ScenarioStep = {
        children: [spy],
        constraints: [],
      } as any
      const topLevelStep = new StepSpy()
      const response: HydraResponse = {
        response: { xhr: { url: 'foo' } },
      } as any
      const runner = getResponseRunner(response, step)
      context.scenarios.push(topLevelStep)

      // when
      await runAll(runner, context)

      // then
      expect(spy.runner).to.have.been.called
      expect(topLevelStep.runner).to.have.been.called
    })

    it('does not run steps when constraint fails', async () => {
      // given
      const spy = new StepSpy()
      const step: ScenarioStep = {
        children: [spy],
        constraints: [new ConstraintMock(false, 'Response')],
      } as any
      const topLevelStep = new StepSpy()
      const response: HydraResponse = {
        xhr: { url: 'foo' },
      } as any
      const runner = getResponseRunner(response, step)
      context.scenarios.push(topLevelStep)

      // when
      await runAll(runner, context)

      // then
      expect(spy.runner).not.to.have.been.called
      expect(topLevelStep.runner).not.to.have.been.called
    })
  })

  describe('resource runner', () => {
    it('runs steps on representation', async () => {
      // given
      const spy = new StepSpy()
      const step: ScenarioStep = {
        children: [spy],
        constraints: [],
      } as any
      const topLevelStep = new StepSpy()
      const resource: Resource = {} as any
      const runner = getResourceRunner(resource, step)
      context.scenarios.push(topLevelStep)

      // when
      await runAll(runner, context)

      // then
      expect(spy.runner).to.have.been.called
      expect(topLevelStep.runner).to.have.been.called
    })

    it('does not run steps when constraint fails', async () => {
      // given
      const spy = new StepSpy()
      const step: ScenarioStep = {
        children: [spy],
        constraints: [new ConstraintMock(false, 'Representation')],
      } as any
      const topLevelStep = new StepSpy()
      const resource: Resource = {} as any
      const runner = getResourceRunner(resource, step)
      context.scenarios.push(topLevelStep)

      // when
      await runAll(runner, context)

      // then
      expect(spy.runner).not.to.have.been.called
      expect(topLevelStep.runner).not.to.have.been.called
    })
  })
})
