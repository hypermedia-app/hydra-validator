import { Hydra } from 'alcaeus'
import { getResponseRunner } from './processResponse'
import { E2eContext } from '../types'
import { ScenarioStep } from './steps'

jest.mock('alcaeus')

describe('processResponse', () => {
    let context: E2eContext & any
    beforeEach(() => {
        context = {
            scenarios: [],
        }
    })

    describe('.getResponseRunner', () => {
        it('fetches representation with alcaeus', async () => {
            // given
            const steps: ScenarioStep[] = []
            const runner = getResponseRunner('urn:resource:id', steps)
            ;(Hydra.loadResource as any).mockResolvedValue({
                xhr: {
                    url: 'x:y:z',
                },
            })

            // when
            await runner.call(context)

            // then
            expect(Hydra.loadResource).toHaveBeenCalledWith('urn:resource:id')
        })
    })
})
