jest.mock('./lib/docsLoader')
jest.mock('./lib/steps/factory')
jest.mock('alcaeus')
jest.mock('')

import { Hydra } from 'alcaeus'
import * as docsLoader from './lib/docsLoader'
import createSteps from './lib/steps/factory'
import { check } from './'
import * as responseChecks from './lib/processResponse'
import { E2eContext } from './types'

describe('validator-e2e', () => {
    let context: E2eContext

    beforeEach(() => {
        context = {
            scenarios: [],
        }
    })

    describe('factory method', () => {
        it('throws if the docs file fails to load', async () => {
            // given
            (docsLoader.load as any).mockImplementationOnce(() => {
                throw new Error('test')
            })

            // when
            const { result } = await check('urn:irrelevant', {
                docs: '/no/such/file',
                cwd: '/',
            }).call(context)

            // then
            expect(result!.status).toBe('failure')
        })
    })

    describe('check', () => {
        it('sets loaded scenarios to context', async () => {
            // given
            (docsLoader.load as any).mockReturnValue({
                steps: [],
            })
            ;(Hydra.loadResource as any).mockResolvedValue({})
            ;(createSteps as any).mockReturnValue([{}, {}, {}])

            // when
            await check('urn:irrelevant', {
                docs: '/no/such/file',
                cwd: '/',
            }).call(context)

            // then
            expect(context.scenarios.length).toBe(3)
        })

        it('passes the loaded response to response checks', async () => {
            // given
            (docsLoader.load as any).mockReturnValue({
                steps: [],
            })
            const response = {}
            ;(Hydra.loadResource as any).mockResolvedValue(response)
            jest.spyOn(responseChecks, 'default')

            // when
            await check('urn:irrelevant', {
                docs: '/no/such/file',
                cwd: '/',
            }).call(context)

            // then
            expect(Hydra.loadResource).toHaveBeenCalledWith('urn:irrelevant')
            expect(responseChecks.default).toHaveBeenCalledWith(response, [])
        })
    })
})
