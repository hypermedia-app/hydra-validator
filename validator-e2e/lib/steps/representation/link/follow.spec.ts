import * as checkRunner from '../../../checkRunner'
import { E2eContext } from '../../../../types'
import { FollowStep } from './follow'
import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'

describe('follow', () => {
  let context: E2eContext & any
  let getUrlRunner: sinon.SinonStub
  beforeEach(() => {
    context = {
      scenarios: [],
    }
    sinon.reset()
    getUrlRunner = sinon.stub(checkRunner, 'getUrlRunner')
  })

  describe('[variable]', () => {
    it('fetches it when value is a string', async () => {
      // given
      const step = new FollowStep({
        variable: 'url',
      }, [])
      context.url = 'http://example.com/'

      // when
      const execute = step.getRunner(null, context)
      await execute.call(context)

      // then
      expect(getUrlRunner)
        .to.have.been.calledWith('http://example.com/', step)
    })
  })
})
