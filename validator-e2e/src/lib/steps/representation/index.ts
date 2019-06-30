import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../types'
import { checkChain } from 'hydra-validator-core'
import { ScenarioStep } from '../'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'

interface ClassStepInit {
    classId: string;
}

export class ClassStep extends ScenarioStep {
    public classId: string

    public constructor (init: ClassStepInit, children: ScenarioStep[]) {
        super(children)

        this.classId = init.classId
    }

    protected appliesToInternal (obj: HydraResource): boolean {
        return 'id' in obj && obj.types.contains(this.classId)
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
