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
                strict: false,
            }).call(context)

            // then
            expect(result!.status).toBe('failure')
        })

        it('sets base path', async () => {
            // given
            (docsLoader.load as any).mockImplementationOnce(() => ({}))
            ;(createSteps as any).mockReturnValue({ steps: [{}, {}, {}] })

            // when
            await check('urn:irrelevant', {
                docs: '/base/path/docs.api',
                cwd: '/',
                strict: false,
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
                strict: false,
            }).call(context)

            // then
            expect(context.scenarios.length).toBe(3)
        })

        it('passes the loaded response to response checks', async () => {
            // given
            (docsLoader.load as any).mockReturnValueOnce({
                steps: [],
            })
            jest.spyOn(responseChecks, 'getUrlRunner')

            // when
            await check('urn:irrelevant', {
                docs: '/no/such/file',
                cwd: '/',
                strict: false,
            }).call(context)

            // then
            expect(responseChecks.getUrlRunner).toHaveBeenCalledWith('urn:irrelevant')
        })

        it('appends entrypoint path to the base URL', async () => {
            // given
            (docsLoader.load as any).mockReturnValueOnce({
                entrypoint: 'some/resource',
                steps: [],
            })
            ;(createSteps as any).mockReturnValue([{}, {}, {}])
            jest.spyOn(responseChecks, 'getUrlRunner')

            // when
            await check('http://base.url/api/', {
                docs: '/no/such/file',
                cwd: '/',
                strict: false,
            }).call(context)

            // then
            expect(responseChecks.getUrlRunner).toHaveBeenCalledWith('http://base.url/api/some/resource')
        })

        it('sets default headers to context', async () => {
            // given
            (docsLoader.load as any).mockReturnValueOnce({
                defaultHeaders: {
                    'Authorization': ['Basic 12345=='],
                },
                steps: [],
            })
            ;(createSteps as any).mockReturnValue([{}, {}, {}])
            jest.spyOn(responseChecks, 'getUrlRunner')

            // when
            await check('http://base.url/api/', {
                docs: '/no/such/file',
                cwd: '/',
                strict: false,
            }).call(context)

            // then
            expect(context.headers).toMatchObject(new Headers({
                Authorization: 'Basic 12345==',
            }))
        })
    })
})
