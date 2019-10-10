import { ScenarioStep } from './'
import { ClassStep } from './representation'
import { StepConstraintInit, factory as createConstraint } from './constraints/'
import { Constraint } from './constraints/Constraint'
import { PropertyStep } from './representation/property'
import { StatusStep } from './response/status'
import { HeaderStep } from './response/header'
import { InvocationStep } from './representation/operation/invocation'
import { OperationStep } from './representation/operation'
import { LinkStep } from './representation/link'
import { FollowStep } from './representation/link/follow'
import { IdentifierStep } from './representation/identifier'

interface StepDescription {
    type: string;
    children: StepDescription[];
    constraints?: StepConstraintInit[];
}

export interface ApiTestScenarios {
    steps: StepDescription[];
}

interface StepConstructor {
    new(stepInit: any, children: ScenarioStep[], constraints: Constraint<unknown>[]): ScenarioStep;
}

const stepConstructors = new Map<string, StepConstructor>()
stepConstructors.set('Class', ClassStep)
stepConstructors.set('Link', LinkStep)
stepConstructors.set('Property', PropertyStep)
stepConstructors.set('ResponseStatus', StatusStep)
stepConstructors.set('ResponseHeader', HeaderStep)
stepConstructors.set('Invocation', InvocationStep)
stepConstructors.set('Follow', FollowStep)
stepConstructors.set('Operation', OperationStep)
stepConstructors.set('Identifier', IdentifierStep)

function create (step: StepDescription): ScenarioStep {
    const children = (step.children || []).map(create)
    const constraints = (step.constraints || []).map(createConstraint)

    const Step = stepConstructors.get(step.type)
    if (Step) {
        return new Step(step, children, constraints)
    }

    throw new Error(`Unexpected step ${step.type}`)
}

export default function (scenarios: ApiTestScenarios) {
    return scenarios.steps.map(step => create(step as any))
}
