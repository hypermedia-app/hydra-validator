import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { E2eContext } from '../types'
import { verifyTopLevelBlocksExecuted } from './strictRunVerification'
import { StepStub } from './steps/stub'

function createVisitedStub(name: string) {
  const stub = new StepStub(name)
  stub.visited = true
  return stub
}

describe('strictRunVerification', () => {
  let context: E2eContext
  beforeEach(() => {
    context = {
      basePath: '',
      scenarios: [],
    }
  })

  describe('strict', () => {
    it('returns informational when all steps are visited', async () => {
      // given
      const steps = [
        createVisitedStub('foo'),
        createVisitedStub('bar'),
      ]
      const runner = verifyTopLevelBlocksExecuted(true, steps)

      // when
      const { result } = await runner.call(context)

      // then
      expect(result!.status).to.eq('informational')
    })

    it('returns failure when some steps are not visited', async () => {
      // given
      const steps = [
        createVisitedStub('foo'),
        new StepStub('bar'),
      ]
      const runner = verifyTopLevelBlocksExecuted(true, steps)

      // when
      const { result } = await runner.call(context)

      // then
      expect(result!.status).to.eq('failure')
    })

    describe('not strict', () => {
      it('returns informational when all steps are visited', async () => {
        // given
        const steps = [
          createVisitedStub('foo'),
          createVisitedStub('bar'),
        ]
        const runner = verifyTopLevelBlocksExecuted(false, steps)

        // when
        const { result } = await runner.call(context)

        // then
        expect(result!.status).to.eq('informational')
      })

      it('returns failure when no steps were visited', async () => {
        // given
        const steps = [
          new StepStub('foo'),
          new StepStub('bar'),
        ]
        const runner = verifyTopLevelBlocksExecuted(false, steps)

        // when
        const { result } = await runner.call(context)

        // then
        expect(result!.status).to.eq('failure')
      })

      it('returns warning when some steps were not visited', async () => {
        // given
        const steps = [
          new StepStub('foo'),
          createVisitedStub('bar'),
        ]
        const runner = verifyTopLevelBlocksExecuted(false, steps)

        // when
        const { result } = await runner.call(context)

        // then
        expect(result!.status).to.eq('warning')
      })
    })
  })
})
