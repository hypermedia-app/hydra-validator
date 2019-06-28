import { HydraResource } from 'alcaeus/types/Resources'
import { E2eContext } from '../../../types'
import { checkChain } from 'hydra-validator-core'
import propertyChecks from './property'
import operationChecks from './operation'
import linkChecks from './link'
import { ScenarioStep } from '../'

export interface PropertyStep extends ScenarioStep {
    propertyId: string;
    executed: boolean;
}

export interface OperationStep extends ScenarioStep {
    operationId: string;
    executed: boolean;
}

export interface RepresentationStep extends ScenarioStep {
    id: string;
    executed: boolean;
}

export default function (resource: HydraResource, resourceScenario: ScenarioStep[]): checkChain<E2eContext> {
    return function checkRepresentation () {
        const nextChecks = resourceScenario.reduce((checks, scenarioStep) => {
            switch (scenarioStep.type) {
                case 'Property':
                    checks.push(propertyChecks(resource, scenarioStep as PropertyStep))
                    break
                case 'Operation':
                    checks.push(operationChecks(resource, scenarioStep as OperationStep))
                    break
                case 'Link':
                    checks.push(linkChecks(resource, scenarioStep as PropertyStep))
                    break
            }

            return checks
        }, [] as checkChain<E2eContext>[])

        return {
            nextChecks,
        }
    }
}
