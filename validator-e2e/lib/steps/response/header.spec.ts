import { HeaderStep } from './header'
import { E2eContext } from '../../../types'
import 'isomorphic-fetch'

describe('header statement', () => {
    let context: E2eContext

    beforeEach(() => {
        context = {
            scenarios: [],
        }
    })

    it('returns success when no value is given and header is present', async () => {
        // given
        const step = new HeaderStep({
            header: 'Location',
        })
        const response = new Response(null, {
            headers: {
                'Location': 'http://example.com',
            },
        })

        // when
        const execute = step.getRunner(response, context)
        const result = execute.call(context)

        // then
        expect(result.result!.status).toBe('success')
    })

    it('returns failure when header is present but value does not match', async () => {
        // given
        const step = new HeaderStep({
            header: 'Location',
            value: 'http://example.org',
        })
        const response = new Response(null, {
            headers: {
                'Location': 'http://example.com',
            },
        })

        // when
        const execute = step.getRunner(response, context)
        const result = execute.call(context)

        // then
        expect(result.result!.status).toBe('failure')
    })

    it('returns success when header value matches expected', async () => {
        // given
        const step = new HeaderStep({
            header: 'Location',
            value: 'http://example.org',
        })
        const response = new Response(null, {
            headers: {
                'Location': 'http://example.org',
            },
        })

        // when
        const execute = step.getRunner(response, context)
        const result = execute.call(context)

        // then
        expect(result.result!.status).toBe('success')
    })

    it('returns success when header value matches pattern', async () => {
        // given
        const step = new HeaderStep({
            header: 'Location',
            pattern: '^http:\\/\\/example\\.',
        })
        const response = new Response(null, {
            headers: {
                'Location': 'http://example.org',
            },
        })

        // when
        const execute = step.getRunner(response, context)
        const result = execute.call(context)

        // then
        expect(result.result!.status).toBe('success')
    })

    it('returns failure when header value does not matches pattern', async () => {
        // given
        const step = new HeaderStep({
            header: 'Location',
            pattern: 'com$',
        })
        const response = new Response(null, {
            headers: {
                'Location': 'http://example.org',
            },
        })

        // when
        const execute = step.getRunner(response, context)
        const result = execute.call(context)

        // then
        expect(result.result!.status).toBe('failure')
    })

    it('returns error when pattern is not a well formed regex', async () => {
        // given
        const step = new HeaderStep({
            header: 'Location',
            pattern: '(unclosed',
        })
        const response = new Response(null, {
            headers: {
                'Location': 'http://example.org',
            },
        })

        // when
        const execute = step.getRunner(response, context)
        const result = execute.call(context)

        // then
        expect(result.result!.status).toBe('error')
    })

    it('returns failure when header is not found', async () => {
        // given
        const step = new HeaderStep({
            header: 'Location',
        })
        const response = new Response(null, { })

        // when
        const execute = step.getRunner(response, context)
        const result = execute.call(context)

        // then
        expect(result.result!.status).toBe('failure')
    })

    it('sets to context when `captureAs` is used', () => {
        // given
        const step = new HeaderStep({
            header: 'Location',
            captureAs: 'url',
        })
        const response = new Response(null, {
            headers: {
                'Location': 'http://example.com',
            },
        })

        // when
        const execute = step.getRunner(response, context)
        execute.call(context)

        // then
        expect(context['url']).toBe('http://example.com')
    })
})
