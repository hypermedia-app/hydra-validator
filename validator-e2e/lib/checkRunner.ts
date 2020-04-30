import Hydra, { HydraResource, ResourceIndexer, HydraResponse } from 'alcaeus'
import { parsers } from '@rdfjs/formats-common'
import { E2eContext } from '../types'
import { checkChain, CheckResult, Result } from 'hydra-validator-core'
import { ScenarioStep } from './steps'
import { Constraint, RepresentationConstraint, ResponseConstraint } from './steps/constraints/Constraint'
import { NamedNode } from 'rdf-js'

parsers.forEach((parser, mediaType) => Hydra.parsers.set(mediaType, parser))

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

  for (const step of steps) {
    if (step.appliesTo(resource)) {
      nextChecks.push(step.getRunner(resource, localContext))
    }
  }

  return {
    nextChecks,
    sameLevel: true,
  }
}

function processResponse(response: HydraResponse, steps: ScenarioStep[], constraints: Constraint[], failOnNegativeResponse: boolean): CheckResult<E2eContext> {
  const localContext = {}

  const nextChecks: checkChain<E2eContext>[] = []
  const resource = response.representation?.root
  const xhr = response.response?.xhr

  if (!xhr) {
    return {
      result: Result.Error('No response to request'),
      sameLevel: true,
    }
  }

  if (!xhr?.ok && failOnNegativeResponse) {
    return {
      result: Result.Failure(`Failed to dereference resource ${xhr.url}. Response was ${xhr.status} ${xhr.statusText}`),
      sameLevel: true,
    }
  }

  const results = [
    Result.Informational(`Fetched resource ${xhr.url}`),
  ]

  if (!xhr.ok) {
    results.push(Result.Warning(`Response was ${xhr.status} ${xhr.statusText}`))
  }

  const responseConstraints: ResponseConstraint[] = constraints.filter(c => c.type === 'Response')
  const allConstraintsSatisfied = responseConstraints.every(c => c.satisfiedBy(response))

  if (!allConstraintsSatisfied) {
    return {
      result: Result.Informational(`Skipping response from ${xhr.url} due to scenario constraints`),
    }
  }

  for (const step of steps) {
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

function dereferenceAndProcess(id: string | NamedNode, steps: ScenarioStep[], constraints: Constraint[], headers: HeadersInit | null, failOnNegativeResponse: boolean) {
  const uri: string = typeof id === 'string' ? id : id.value

  const loadResource = headers
    ? Hydra.loadResource(uri, headers)
    : Hydra.loadResource(uri)

  return loadResource
    .then(response => {
      return processResponse(response, steps, constraints, failOnNegativeResponse)
    })
    .catch(e => ({
      result: Result.Error(`Failed to dereference ${uri}`, e),
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

export function getUrlRunner(id: string, currentStep?: ScenarioStep, failOnNegativeResponse = false) {
  const childSteps = currentStep ? currentStep.children : []
  const constraints = currentStep ? currentStep.constraints : []

  return async function checkResourceResponse(this: E2eContext) {
    const steps = [...childSteps, ...this.scenarios]

    return dereferenceAndProcess(id, steps, constraints, this.headers || null, failOnNegativeResponse)
  }
}

export function getResponseRunner(
  resourceOrResponse: HydraResource | HydraResponse,
  currentStep?: ScenarioStep,
  failOnNegativeResponse = false) {
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

        return dereferenceAndProcess(resourceOrResponse.id, steps, constraints, this.headers || null, failOnNegativeResponse)
      }
      return processResponse(resourceOrResponse, steps, constraints, failOnNegativeResponse)
    }

    return {
      result: Result.Failure(`Could not dereference resource. Value ${resourceOrResponse} does not appear to be a link`),
    }
  }
}
