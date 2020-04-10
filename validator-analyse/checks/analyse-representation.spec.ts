jest.mock('./api-documentation')

import check from './analyse-representation'
import apiDocsChecks from './api-documentation'
import rdf from 'rdf-ext'

describe('analyse-representation', () => {
  describe('when parsing succeeds', () => {
    let response: Response & any

    beforeEach(() => {
      response = {
        url: 'https://example.com/',
        dataset: jest.fn(),
      }

      response.dataset.mockResolvedValue(rdf.dataset())
    })

    test('queues api doc tests if flag is true', async () => {
      // given
      ;(apiDocsChecks as any).mockReturnValue([])

      // when
      const { nextChecks } = await check(response, true).call({})

      // then
      expect(apiDocsChecks).toHaveBeenCalled()
      expect(nextChecks).toBeDefined()
    })

    test('should keep the current level', async () => {
      // given
      ;(apiDocsChecks as any).mockReturnValue([])

      // when
      const { sameLevel } = await check(response, false).call({})

      // then
      expect(sameLevel).toBeTruthy()
    })

    test('should pass', async () => {
      // when
      const { result } = await check(response, false).call({})

      // then
      expect(result!.status).toEqual('success')
    })
  })

  describe('when parsing fails', () => {
    test('should fail', async () => {
      // given
      const response = {
        url: 'https://example.com',
        dataset: jest.fn(),
      }

      response.dataset.mockRejectedValue(new Error())

      // when
      const { result } = await check(response, false).call({})

      // then
      expect(result!.status).toEqual('failure')
    })
  })
})
