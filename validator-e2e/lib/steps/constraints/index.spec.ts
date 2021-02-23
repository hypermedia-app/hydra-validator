import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import sinon from 'sinon'
import { factory, StepConstraintInit } from './'
import * as conditions from './conditions/'
import * as PC from './PropertyConstraint'
import * as SC from './StatusConstraint'

describe('factory', () => {
  const emptyInit: StepConstraintInit = {} as any

  beforeEach(() => {
    sinon.stub(conditions, 'factory').returns(() => true)
    sinon.stub(PC)
    sinon.stub(SC)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('throws when type is unsupported', () => {
    // given
    const init = {
      ...emptyInit,
      constrain: 'Collection' as any,
    }

    // then
    expect(() => factory(init)).to.throw()
  })

  it('throws when type is falsy', () => {
    // then
    expect(() => factory(emptyInit)).to.throw()
  })

  it('calls conditionFactory', () => {
    // given
    const init: StepConstraintInit = { ...emptyInit, constrain: 'Property' }

    // when
    factory(init)

    // then
    expect(conditions.factory).to.have.been.calledWith(init)
  })

  it('creates PropertyConstraint', () => {
    // given
    const init: StepConstraintInit = {
      ...emptyInit,
      constrain: 'Property',
      left: 'prop-name',
    }

    // when
    factory(init)

    // then
    expect(PC.PropertyConstraint).to.have.been.called
  })

  it('calls StatusConstraint', () => {
    // given
    const init: StepConstraintInit = { ...emptyInit, constrain: 'Status' }

    // when
    factory(init)

    // then
    expect(SC.StatusConstraint).to.have.been.called
  })
})
