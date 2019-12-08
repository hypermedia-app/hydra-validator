import { getUrlRunner } from '../../../checkRunner'
import { E2eContext } from '../../../../types'
import { FollowStep } from './follow'

jest.mock('../../../checkRunner')

describe('follow', () => {
  let context: E2eContext & any
  beforeEach(() => {
    context = {
      scenarios: [],
    }
    jest.resetAllMocks()
  })

  describe('[variable]', () => {
    it('fetches it when value is a string', async () => {
      // given
      const step = new FollowStep({
        variable: 'url',
      }, [])
      context['url'] = 'http://example.com/'

      // when
      const execute = step.getRunner(null, context)
      await execute.call(context)

      // then
      expect(getUrlRunner)
        .toHaveBeenCalledWith('http://example.com/', step)
    })
  })
})
