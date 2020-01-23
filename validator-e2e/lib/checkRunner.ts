import Hydra, { HydraResource, ResourceIndexer } from 'alcaeus'
import { HydraResponse } from 'alcaeus/types/HydraResponse'
import { E2eContext } from '../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from './steps'
import { Constraint, RepresentationConstraint, ResponseConstraint } from './steps/constraints/Constraint'
import { NamedNode } from 'rdf-js'

function processResource<T>(resource: T, steps: ScenarioStep[], constraints: Constraint[]): CheckResult<E2eContext> {
  const localContext = {}
  const nextChecks: checkChain<E2eContext>[] = []

  const resourceConstraints: RepresentationConstraint[] = constraints.filter(c => c.type === 'Representation')
  const allConstraintsSatisfied = resourceConstraints.every(c => c.satisfiedBy(resource as unknown as HydraResource & ResourceIndexer))

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

function processResponse(response: HydraResponse, steps: ScenarioStep[], constraints: Constraint[]): CheckResult<E2eContext> {
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

function dereferenceAndProcess(id: string | NamedNode, steps: ScenarioStep[], constraints: Constraint[], headers: HeadersInit | null) {
  const uri: string = typeof id === 'string' ? id : id.value

  const loadResource = headers
    ? Hydra.loadResource(uri, headers)
    : Hydra.loadResource(uri)

  return loadResource
    .then(async response => {
      await Hydra.apiDocumentations
      return response
    })
    .then(response => {
      return processResponse(response, steps, constraints)
    })
    .catch(e => ({
      result: Result.Warning(`Failed to dereference ${id}`, e),
    }))
}

export function getResourceRunner<T>(
  resource: T,
  currentStep: ScenarioStep) {
  return async function checkResource(this: E2eContext) {
    const steps = [...currentStep.children, ...this.scenarios].filter(s => s !== currentStep)
    return processResource(resource, steps, currentStep.constraints)
  }
}

export function getUrlRunner(id: string, currentStep?: ScenarioStep) {
  const childSteps = currentStep ? currentStep.children : []
  const constraints = currentStep ? currentStep.constraints : []

  return async function checkResourceResponse(this: E2eContext) {
    const steps = [...childSteps, ...this.scenarios]

    return dereferenceAndProcess(id, steps, constraints, this.headers || null)
  }
}

export function getResponseRunner(
  resourceOrResponse: HydraResource | HydraResponse,
  currentStep?: ScenarioStep) {
  const childSteps = currentStep ? currentStep.children : []
  const constraints = currentStep ? currentStep.constraints : []

  return async function checkResourceResponse(this: E2eContext) {
    const steps = [...childSteps, ...this.scenarios]

    if (typeof resourceOrResponse === 'object') {
      if ('id' in resourceOrResponse) {
        if (resourceOrResponse.id.termType === 'BlankNode') {
          return {
            result: Result.Failure('Cannot dereference blank node identifier'),
          }
        }

        return dereferenceAndProcess(resourceOrResponse.id, steps, constraints, this.headers || null)
      }
      return processResponse(resourceOrResponse as HydraResponse, steps, constraints)
    }

    return {
      result: Result.Failure(`Could not dereference resource. Value ${resourceOrResponse} does not appear to be a link`),
    }
  }
}
