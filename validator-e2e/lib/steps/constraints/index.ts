import { Constraint, ConstraintOperator } from './Constraint'
import { factory as createPredicate } from './conditions/'
import { StatusConstraint } from './StatusConstraint'
import { PropertyConstraint } from './PropertyConstraint'

export interface StepConstraintInit {
    constrain: 'Property' | 'Status';
    negated: boolean;
    left?: string;
    operator: ConstraintOperator;
    right: unknown;
}

export function factory (constraintInit: StepConstraintInit): Constraint<unknown> {
    const predicate = createPredicate(constraintInit)

    switch (constraintInit.constrain) {
        case 'Status':
            return new StatusConstraint(predicate, constraintInit.negated)
        case 'Property':
            return new PropertyConstraint(constraintInit, predicate, constraintInit.negated)
        default:
            throw new Error(`Unexpected constraint ${constraintInit.constrain}`)
    }
}
