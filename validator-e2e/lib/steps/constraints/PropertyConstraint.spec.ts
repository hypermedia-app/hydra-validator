import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import sinon from 'sinon'
import cf, { AnyContext, AnyPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { Hydra } from 'alcaeus/node'
import { PropertyConstraint } from './PropertyConstraint'
import { StepConstraintInit } from './index'
import DatasetExt from 'rdf-ext/lib/Dataset'

describe('PropertyConstraint', () => {
  const emptyInit: StepConstraintInit = {} as any
  let graph: AnyPointer<AnyContext, DatasetExt>

  beforeEach(() => {
    graph = cf({ dataset: $rdf.dataset() })
  })

  it('does not pass when property is undefined', () => {
    // given
    const predicate = sinon.stub()
    const property = 'http://example.com/prop'
    const init = {
      ...emptyInit,
      left: property,
    }
    const constraint = new PropertyConstraint(init, predicate, false)

    // when
    const result = constraint.satisfiedBy(Hydra.resources.factory.createEntity(graph.blankNode()))

    // then
    expect(result).to.eq(false)
    expect(predicate).not.to.have.been.called
  })

  it('throws when property name is missing', () => {
    // given
    const predicate = sinon.stub()
    const init = {
      ...emptyInit,
    }

    // then
    expect(() => new PropertyConstraint(init, predicate, false)).to.throw()
  })
})
