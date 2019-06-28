import { ScenarioStep } from './'

export function isResponseStep (step: ScenarioStep) {
    return step.type === 'Expectation'
}

export function isRepresentationStep (step: ScenarioStep) {
    return step.type !== 'Expectation'
}
