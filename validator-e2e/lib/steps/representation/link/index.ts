import { HydraResource } from 'alcaeus/Resources'
import { checkChain, Result } from 'hydra-validator-core'
import { getResponseRunner } from '../../../checkRunner'
import { ScenarioStep } from '../../index'
import { Constraint } from '../../constraints/Constraint'
import { E2eContext } from '../../../../types'
import { namedNode } from '@rdfjs/data-model'
import { NamedNode } from 'rdf-js'

interface LinkStepInit {
  rel: string
  strict: boolean
}

export class LinkStep extends ScenarioStep<HydraResource> {
  private relation: NamedNode
  private strict: boolean

  public constructor(init: LinkStepInit, children: ScenarioStep[], constraints: Constraint[]) {
    super(children, constraints)

    this.relation = namedNode(init.rel)
    this.strict = init.strict
  }

  protected appliesToInternal(obj: HydraResource): boolean {
    return 'id' in obj
  }

  public getRunner(resource: HydraResource): checkChain<E2eContext> {
    const step = this

    return async function checkLink() {
      if (step.executed) {
        return {}
      }

      const linkValue = resource.getLinks()
        .find(link => link.supportedProperty.property.id.equals(step.relation))

      // found supportedProperty which is a hydra:Link
      if (linkValue) {
        step.markExecuted()

        return {
          result: Result.Informational(`Stepping into link ${step.relation.value}`),
          nextChecks: linkValue.resources.map(resource => getResponseRunner(resource, step)),
        }
      }

      // the resource may have a matching key, but not a supportedProperty hydra:Links
      const potentialLinks = resource.getArray<HydraResource>(step.relation)

      if (potentialLinks.length > 0) {
        step.markExecuted()

        return {
          result: Result.Warning(
            `Stepping into link ${step.relation.value}`,
            `Resources found but ${step.relation.value} is not a SupportedProperty of hydra:Link type.`),
          nextChecks: potentialLinks.map(resource => getResponseRunner(resource, step)),
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
}
