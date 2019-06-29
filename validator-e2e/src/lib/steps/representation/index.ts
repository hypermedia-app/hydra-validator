import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../types'
import { checkChain } from 'hydra-validator-core'
import { ScenarioStep } from '../'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'

export class ClassStep extends ScenarioStep {
    public classId: string

    public constructor (classId: string, children: ScenarioStep[]) {
        super(children)

        this.classId = classId
    }

    protected appliesToInternal (obj: HydraResource | IHydraResponse): boolean {
        return 'id' in obj
    }

    public getRunner (resource: HydraResource | IHydraResponse): checkChain<E2eContext> {
        const step = this

        return function checkRepresentation () {
            const nextChecks = step.children.reduce((checks, scenarioStep) => {
                if (scenarioStep.appliesTo(resource)) {
                    checks.push(scenarioStep.getRunner(resource))
                }

                return checks
            }, [] as checkChain<E2eContext>[])

            return {
                nextChecks,
            }
        }
    }
}
