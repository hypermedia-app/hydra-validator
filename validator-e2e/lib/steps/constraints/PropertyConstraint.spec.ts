import cf, { Clownface } from 'clownface'
import $rdf from 'rdf-ext'
import Hydra from 'alcaeus'
import { PropertyConstraint } from './PropertyConstraint'
import { StepConstraintInit } from './index'

describe('PropertyConstraint', () => {
  const emptyInit: StepConstraintInit = {} as any
  let graph: Clownface

  beforeEach(() => {
    graph = cf({ dataset: $rdf.dataset() })
  })

  it('does not pass when property is undefined', () => {
    // given
    const predicate = jest.fn()
    const property = 'http://example.com/prop'
    const init = {
      ...emptyInit,
      left: property,
    }
    const constraint = new PropertyConstraint(init, predicate, false)

    // when
    const result = constraint.satisfiedBy(Hydra.factory.createEntity(graph.blankNode()))

    // then
    expect(result).toBeFalsy()
    expect(predicate).not.toHaveBeenCalled()
  })

  it('throws when property name is missing', () => {
    // given
    const predicate = jest.fn()
    const init = {
      ...emptyInit,
    }

    // then
    expect(() => new PropertyConstraint(init, predicate, false)).toThrow()
  })
})
