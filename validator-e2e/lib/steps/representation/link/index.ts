import { IriTemplate, Resource } from 'alcaeus'
import { checkChain, Result } from 'hydra-validator-core'
import { getResponseRunner, getUrlRunner } from '../../../checkRunner'
import { ScenarioStep } from '../../index'
import { Constraint } from '../../constraints/Constraint'
import { E2eContext } from '../../../../types'
import { namedNode } from '@rdfjs/data-model'
import { NamedNode } from 'rdf-js'
import { StatusStep } from '../../response/status'
import clownface from 'clownface'
import $rdf from 'rdf-ext'

interface TemplateVariable {
  key: string
  value: string
}

interface LinkStepInit {
  rel: string
  strict: boolean
  variables?: TemplateVariable[]
}

function reduceVariables(variables: Record<string, string | string[]>, variable: TemplateVariable) {
  const value = variables[variable.key]

  if (!value) {
    return {
      ...variables,
      [variable.key]: variable.value,
    }
  }

  if (Array.isArray(value)) {
    return {
      ...variables,
      [variable.key]: [...value, variable.value],
    }
  }

  return {
    ...variables,
    ...variables,
    [variable.key]: [value, variable.value],
  }
}

export class LinkStep extends ScenarioStep<Resource> {
  private relation: NamedNode
  private strict: boolean
  private variables: Record<string, string | string[]>

  public constructor(init: LinkStepInit, children: ScenarioStep[], constraints: Constraint[]) {
    super(children, constraints)

    this.relation = namedNode(init.rel)
    this.strict = init.strict
    this.variables = init.variables?.reduce(reduceVariables, {}) || {}
  }

  protected appliesToInternal(obj: Resource): boolean {
    return 'id' in obj
  }

  public getRunner(resource: Resource): checkChain<E2eContext> {
    const step = this

    return async function checkLink() {
      if (step.executed) {
        return {}
      }

      const linkValue = resource.getLinks()
        .find(link => link.supportedProperty.id.equals(step.relation))

      // found supportedProperty which is a hydra:Link
      if (linkValue) {
        step.markExecuted()

        return {
          result: Result.Informational(`Stepping into link ${step.relation.value}`),
          nextChecks: linkValue.resources.map(resource => step.__dereferenceLinkedResource(resource as any, step)),
        }
      }

      // the resource may have a matching key, but not a supportedProperty hydra:Links
      const potentialLinks = resource.getArray<Resource>(step.relation)

      if (potentialLinks.length > 0) {
        step.markExecuted()

        return {
          result: Result.Warning(
            `Stepping into link ${step.relation.value}`,
            `Resources found but ${step.relation.value} is not a SupportedProperty of hydra:Link type.`),
          nextChecks: potentialLinks.map(resource => step.__dereferenceLinkedResource(resource, step)),
        }
      }

      if (step.strict) {
        return {
          result: Result.Failure(`No resources found on resource ${resource.id.value} linked with ${step.relation.value}`),
        }
      }

      return {}
    }
  }

  private __dereferenceLinkedResource(resource: Resource | IriTemplate, step: this) {
    const failOnNegativeResponse = step.children.length > 0 && !step.children.some(child => child instanceof StatusStep)

    if ('expand' in resource) {
      const variables = [...Object.entries(step.variables)].reduce((pointer, [predicate, objects]) => {
        return pointer.addOut($rdf.namedNode(predicate), objects)
      }, clownface({ dataset: $rdf.dataset() }).blankNode())
      return getUrlRunner(resource.expand(variables), step, failOnNegativeResponse)
    }

    return getResponseRunner(resource, step, failOnNegativeResponse)
  }
}
