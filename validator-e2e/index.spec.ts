jest.mock('./lib/docsLoader')
jest.mock('./lib/steps/factory')
jest.mock('')

import * as docsLoader from './lib/docsLoader'
import createSteps from './lib/steps/factory'
import { check } from './'
import * as responseChecks from './lib/checkRunner'
import { E2eContext } from './types'

describe('validator-e2e', () => {
    let context: E2eContext

    beforeEach(() => {
        context = {
            scenarios: [],
            basePath: '',
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

        it('sets base path', async () => {
            // given
            (docsLoader.load as any).mockImplementationOnce(() => ({}))

            // when
            await check('urn:irrelevant', {
                docs: '/base/path/docs.api',
                cwd: '/',
            }).call(context)

            // then
            expect(context.basePath).toBe('/base/path')
        })
    })

    describe('check', () => {
        it('sets loaded scenarios to context', async () => {
            // given
            (docsLoader.load as any).mockReturnValue({
                steps: [],
            })
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
            jest.spyOn(responseChecks, 'getUrlRunner')

            // when
            await check('urn:irrelevant', {
                docs: '/no/such/file',
                cwd: '/',
            }).call(context)

            // then
            expect(responseChecks.getUrlRunner).toHaveBeenCalledWith('urn:irrelevant')
        })
    })
})
