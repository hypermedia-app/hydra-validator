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
import { SpyMixin } from './StepSpyMixin'

interface StepDescription {
  type: string
  children: StepDescription[]
  constraints?: StepConstraintInit[]
}

export type RuntimeStep = ScenarioStep & {
  visited: boolean
}

interface StepConstructor<T> {
  new(stepInit: any, children: ScenarioStep[], constraints: Constraint<unknown>[]): T
}

const stepConstructors = new Map<string, StepConstructor<RuntimeStep>>()
function registerStep<T>(name: string, ctor: StepConstructor<ScenarioStep>) {
  stepConstructors.set(name, SpyMixin(ctor))
}

registerStep('Class', ClassStep)
registerStep('Link', LinkStep)
registerStep('Property', PropertyStep)
registerStep('ResponseStatus', StatusStep)
registerStep('ResponseHeader', HeaderStep)
registerStep('Invocation', InvocationStep)
registerStep('Follow', FollowStep)
registerStep('Operation', OperationStep)
registerStep('Identifier', IdentifierStep)

function create(step: StepDescription): RuntimeStep {
  const children = (step.children || []).map(create)
  const constraints = (step.constraints || []).map(createConstraint)

  const Step = stepConstructors.get(step.type)
  if (Step) {
    return new Step(step, children, constraints)
  }

  throw new Error(`Unexpected step ${step.type}`)
}

export default function (steps: any[]): RuntimeStep[] {
  return steps.map(step => create(step))
}
