import { Hydra } from 'alcaeus'
import { getResponseRunner, getResourceRunner } from './checkRunner'
import { E2eContext } from '../types'
import { ScenarioStep } from './steps'
import { HydraResource } from 'alcaeus/types/Resources'
import { ConstraintMock, StepSpy } from './steps/stub'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { runAll } from './testHelpers'

jest.mock('alcaeus')

const loadResource: jest.Mock = Hydra.loadResource as any

describe('processResponse', () => {
    let context: E2eContext
    beforeEach(() => {
        loadResource.mockReset()
        context = {
            basePath: '',
            scenarios: [],
        }
    })

    describe('response runner', () => {
        it('fetches representation with alcaeus', async () => {
            // given
            const step: ScenarioStep = {
                children: [ ],
                constraints: [],
            } as any
            const runner = getResponseRunner('urn:resource:id', step)
            loadResource.mockResolvedValue({
                xhr: {
                    url: 'x:y:z',
                },
            })

            // when
            await runner.call(context)

            // then
            expect(loadResource).toHaveBeenCalledWith('urn:resource:id')
        })

        it('does not perform request when passed a response object', async () => {
            // given
            const step: ScenarioStep = {
                children: [ ],
                constraints: [],
            } as any
            const response: IHydraResponse = {
                xhr: { url: 'foo' },
            } as any
            const runner = getResponseRunner(response, step)

            // when
            await runner.call(context)

            // then
            expect(Hydra.loadResource).not.toHaveBeenCalled()
        })
        it('runs steps on representation', async () => {
            // given
            const spy = new StepSpy()
            const step: ScenarioStep = {
                children: [ spy ],
                constraints: [],
            } as any
            const topLevelStep = new StepSpy()
            const response: IHydraResponse = {
                xhr: { url: 'foo' },
            } as any
            const runner = getResponseRunner(response, step)
            context.scenarios.push(topLevelStep)

            // when
            await runAll(runner, context)

            // then
            expect(spy.runner).toHaveBeenCalled()
            expect(topLevelStep.runner).toHaveBeenCalled()
        })

        it('does not run steps when constraint fails', async () => {
            // given
            const spy = new StepSpy()
            const step: ScenarioStep = {
                children: [ spy ],
                constraints: [ new ConstraintMock(false, 'Response') ],
            } as any
            const topLevelStep = new StepSpy()
            const response: IHydraResponse = {
                xhr: { url: 'foo' },
            } as any
            const runner = getResponseRunner(response, step)
            context.scenarios.push(topLevelStep)

            // when
            await runAll(runner, context)

            // then
            expect(spy.runner).not.toHaveBeenCalled()
            expect(topLevelStep.runner).not.toHaveBeenCalled()
        })
    })

    describe('resource runner', () => {
        it('runs steps on representation', async () => {
            // given
            const spy = new StepSpy()
            const step: ScenarioStep = {
                children: [ spy ],
                constraints: [],
            } as any
            const topLevelStep = new StepSpy()
            const resource: HydraResource = {} as any
            const runner = getResourceRunner(resource, step)
            context.scenarios.push(topLevelStep)

            // when
            await runAll(runner, context)

            // then
            expect(spy.runner).toHaveBeenCalled()
            expect(topLevelStep.runner).toHaveBeenCalled()
        })

        it('does not run steps when constraint fails', async () => {
            // given
            const spy = new StepSpy()
            const step: ScenarioStep = {
                children: [ spy ],
                constraints: [ new ConstraintMock(false, 'Representation') ],
            } as any
            const topLevelStep = new StepSpy()
            const resource: HydraResource = {} as any
            const runner = getResourceRunner(resource, step)
            context.scenarios.push(topLevelStep)

            // when
            await runAll(runner, context)

            // then
            expect(spy.runner).not.toHaveBeenCalled()
            expect(topLevelStep.runner).not.toHaveBeenCalled()
        })
    })
})
