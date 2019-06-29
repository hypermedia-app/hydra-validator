import { ScenarioStep } from './'
import { ClassStep } from './representation'
import { PropertyStep } from './representation/property'
import { ExpectationStep } from './response/expectation'
import { InvocationStep } from './representation/operation/invocation'
import { OperationStep } from './representation/operation'
import { LinkStep } from './representation/link'

interface StepDescription {
    type: 'Class' | 'Expectation' | 'Operation' | 'Property' | 'Invocation' | 'Link';
    children: StepDescription[];
}

export interface ApiTestScenarios {
    steps: StepDescription[];
}

function create (step: StepDescription & { [key: string]: string }): ScenarioStep {
    const children = (step.children || []).map(child => create(child as any))

    switch (step.type) {
        case 'Class':
            return new ClassStep(step.classId, children)
        case 'Link':
            return new LinkStep(step.propertyId, children)
        case 'Property':
            return new PropertyStep(step.propertyId, children)
        case 'Expectation':
            return new ExpectationStep(step, children)
        case 'Operation':
            return new OperationStep(step.operationId, children)
        case 'Invocation':
            return new InvocationStep(step.body, children)
        default:
            throw new Error(`Unexpected step ${step.type}`)
    }
}

export default function (scenarios: ApiTestScenarios) {
    return scenarios.steps.map(step => create(step as any))
}
