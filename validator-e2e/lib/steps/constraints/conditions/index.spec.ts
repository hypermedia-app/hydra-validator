import { factory } from './'
import { StepConstraintInit } from '../'
import { expect } from 'chai'
import { describe, it } from 'mocha'

describe('condition', () => {
  const emptyInit: StepConstraintInit = {} as any

  it('throws when condition is unrecognized', () => {
    // given
    const init = { ...emptyInit, operator: 'foo' } as any

    // then
    expect(() => factory(init)).to.throw()
  })

  describe('eq', () => {
    it('returns true when string values are equal', () => {
      // given
      const init: StepConstraintInit = {
        ...emptyInit,
        operator: 'eq',
        right: 'expected',
      }

      // when
      const equality = factory(init)
      const result = equality('expected')

      // then
      expect(result).to.eq(true)
    })
  })

  describe('lt', () => {
    it('returns correct result', () => {
      // given
      const init: StepConstraintInit = {
        ...emptyInit,
        operator: 'lt',
        right: 100,
      }

      // when
      const equality = factory(init)
      const result = equality(99)

      // then
      expect(result).to.eq(true)
    })
  })

  describe('le', () => {
    it('returns correct result', () => {
      // given
      const init: StepConstraintInit = {
        ...emptyInit,
        operator: 'le',
        right: 100,
      }

      // when
      const equality = factory(init)
      const result = equality(100)

      // then
      expect(result).to.eq(true)
    })
  })

  describe('ge', () => {
    it('returns correct result', () => {
      // given
      const init: StepConstraintInit = {
        ...emptyInit,
        operator: 'ge',
        right: 100,
      }

      // when
      const equality = factory(init)
      const result = equality(100)

      // then
      expect(result).to.eq(true)
    })
  })

  describe('gt', () => {
    it('returns correct result', () => {
      // given
      const init: StepConstraintInit = {
        ...emptyInit,
        operator: 'gt',
        right: 100,
      }

      // when
      const equality = factory(init)
      const result = equality(101)

      // then
      expect(result).to.eq(true)
    })
  })

  describe('regex', () => {
    it('returns true for matching value', () => {
      // given
      const init: StepConstraintInit = {
        ...emptyInit,
        operator: 'regex',
        right: '^ex',
      }

      // when
      const regex = factory(init)
      const result = regex('expected')

      // then
      expect(result).to.eq(true)
    })
  })

  describe('custom', () => {
    it('returns true for matching value', () => {
      // given
      const init: StepConstraintInit = {
        ...emptyInit,
        operator: 'function',
        // eslint-disable-next-line no-template-curly-in-string
        right: 'name => `AS ${name.toUpperCase()}`',
      }

      // when
      const regex = factory(init)
      const result = regex('expected')

      // then
      expect(result).to.eq('AS EXPECTED')
    })
  })
})
