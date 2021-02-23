import { expect } from 'chai'
import { describe, it } from 'mocha'
import sinon from 'sinon'
import { StatusConstraint } from './StatusConstraint'

describe('StatusConstraint', () => {
  it('does not pass when status is 0', () => {
    // given
    const predicate = sinon.stub()
    const constraint = new StatusConstraint(predicate, false)

    // when
    const result = constraint.satisfiedBy({
      xhr: {
        status: 0,
      },
    } as any)

    // then
    expect(result).to.eq(false)
    expect(predicate).not.to.have.been.called
  })

  it('calls predicate when status code is within range', () => {
    // given
    const predicate = sinon.stub().callsFake(() => true)
    const constraint = new StatusConstraint(predicate, false)

    // when
    const result = constraint.satisfiedBy({
      response: {
        xhr: {
          status: 303,
        },
      },
    } as any)

    // then
    expect(result).to.eq(true)
    expect(predicate).to.have.been.calledWith(303)
  })
})
