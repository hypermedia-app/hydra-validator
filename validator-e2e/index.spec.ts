import * as docsLoader from './lib/docsLoader'
import * as createSteps from './lib/steps/factory'
import { check } from './'
import * as responseChecks from './lib/checkRunner'
import { E2eContext } from './types'
import { expect } from 'chai'
import { describe, beforeEach, it } from 'mocha'
import sinon from 'sinon'

describe('validator-e2e', () => {
  let context: E2eContext

  beforeEach(() => {
    context = {
      scenarios: [],
      basePath: '',
    }

    sinon.restore()
    sinon.stub(responseChecks)
  })

  describe('factory method', () => {
    it('throws if the docs file fails to load', async () => {
      // given
      sinon.stub(docsLoader, 'load').throws(new Error('test'))

      // when
      const { result } = await check('urn:irrelevant', {
        docs: '/no/such/file',
        cwd: '/',
        strict: false,
      }).call(context)

      // then
      expect(result!.status).to.eq('failure')
    })

    it('sets base path', async () => {
      // given
      sinon.stub(docsLoader, 'load').callsFake(() => ({} as any))
      sinon.stub(createSteps, 'default').returns({ steps: [{}, {}, {}] } as any)

      // when
      await check('urn:irrelevant', {
        docs: '/base/path/docs.api',
        cwd: '/',
        strict: false,
      }).call(context)

      // then
      expect(context.basePath).to.eq('/base/path')
    })
  })

  describe('check', () => {
    it('sets loaded scenarios to context', async () => {
      // given
      sinon.stub(docsLoader, 'load').returns({
        steps: [],
      })
      sinon.stub(createSteps, 'default').returns([{}, {}, {}] as any)

      // when
      await check('urn:irrelevant', {
        docs: '/no/such/file',
        cwd: '/',
        strict: false,
      }).call(context)

      // then
      expect(context.scenarios.length).to.eq(3)
    })

    it('passes the loaded response to response checks', async () => {
      // given
      sinon.stub(docsLoader, 'load').returns({
        steps: [],
      })

      // when
      await check('urn:irrelevant', {
        docs: '/no/such/file',
        cwd: '/',
        strict: false,
      }).call(context)

      // then
      expect(responseChecks.getUrlRunner).to.have.been.calledWith('urn:irrelevant')
    })

    it('appends entrypoint path to the base URL', async () => {
      // given
      sinon.stub(docsLoader, 'load').returns({
        entrypoint: 'some/resource',
        steps: [],
      })
      sinon.stub(createSteps, 'default').returns([{}, {}, {}] as any)

      // when
      await check('http://base.url/api/', {
        docs: '/no/such/file',
        cwd: '/',
        strict: false,
      }).call(context)

      // then
      expect(responseChecks.getUrlRunner).to.have.been.calledWith('http://base.url/api/some/resource')
    })

    it('sets default headers to context', async () => {
      // given
      sinon.stub(docsLoader, 'load').returns({
        defaultHeaders: {
          Authorization: ['Basic 12345=='],
        },
        steps: [],
      })
      sinon.stub(createSteps, 'default').returns([{}, {}, {}] as any)

      // when
      await check('http://base.url/api/', {
        docs: '/no/such/file',
        cwd: '/',
        strict: false,
      }).call(context)

      // then
      expect(context.headers?.get('Authorization')).to.eq('Basic 12345==')
    })
  })
})
