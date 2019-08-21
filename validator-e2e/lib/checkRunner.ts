import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from './steps'
import { HydraResource } from 'alcaeus/types/Resources'
import { Constraint, RepresentationConstraint, ResponseConstraint } from './steps/constraints/Constraint'

function processResource<T> (resource: T, steps: ScenarioStep[], constraints: Constraint[]): CheckResult<E2eContext> {
    const localContext = {}
    const nextChecks: checkChain<E2eContext>[] = []

    const resourceConstraints: RepresentationConstraint[] = constraints.filter(c => c.type === 'Representation')
    const allConstraintsSatisfied = resourceConstraints.every(c => c.satisfiedBy(resource as unknown as HydraResource))

    if (!allConstraintsSatisfied) {
        return {
            result: Result.Informational(`Skipping representation steps due to scenario constraints`),
        }
    }

    for (let step of steps) {
        if (step.appliesTo(resource)) {
            nextChecks.push(step.getRunner(resource, localContext))
        }
    }

    return {
        nextChecks,
        sameLevel: true,
    }
}

function processResponse (response: IHydraResponse, steps: ScenarioStep[], constraints: Constraint[]): CheckResult<E2eContext> {
    const localContext = {}

    const nextChecks: checkChain<E2eContext>[] = []
    const resource = response.root
    const xhr = response.xhr

    const results = [
        Result.Informational(`Fetched resource ${xhr.url}`),
    ]

    const responseConstraints: ResponseConstraint[] = constraints.filter(c => c.type === 'Response')
    const allConstraintsSatisfied = responseConstraints.every(c => c.satisfiedBy(response))

    if (!allConstraintsSatisfied) {
        return {
            result: Result.Informational(`Skipping response from ${response.xhr.url} due to scenario constraints`),
        }
    }

    for (let step of steps) {
        if (step.appliesTo(xhr)) {
            nextChecks.push(step.getRunner(xhr, localContext))
        }
    }

    if (!resource) {
        results.push(Result.Warning('Could not determine the resource representation'))
    } else {
        nextChecks.push(() => processResource(resource, steps, constraints))
    }

    return {
        results,
        nextChecks,
        sameLevel: true,
    }
}

export function getResourceRunner<T> (
    resource: T,
    currentStep: ScenarioStep) {
    return async function checkResource (this: E2eContext) {
        const steps = [...currentStep.children, ...this.scenarios].filter(s => s !== currentStep)
        return processResource(resource, steps, currentStep.constraints)
    }
}

export function getResponseRunner (
    responseOrId: string | IHydraResponse,
    currentStep?: ScenarioStep) {
    const childSteps = currentStep ? currentStep.children : []
    const constraints = currentStep ? currentStep.constraints : []

    return async function checkResourceResponse (this: E2eContext) {
        const steps = [...childSteps, ...this.scenarios]

        if (typeof responseOrId === 'string') {
            const response = await Hydra.loadResource(responseOrId)
            return processResponse(response, steps, constraints)
        }

        return processResponse(responseOrId, steps, constraints)
    }
}
