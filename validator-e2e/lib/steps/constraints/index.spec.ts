import { factory, StepConstraintInit } from './'
import { factory as conditionFactory } from './conditions/'
import { PropertyConstraint } from './PropertyConstraint'
import { StatusConstraint } from './StatusConstraint'

jest.mock('./conditions/')
jest.mock('./PropertyConstraint')
jest.mock('./StatusConstraint')

describe('factory', () => {
    const emptyInit: StepConstraintInit = {} as any

    it('throws when type is unsupported', () => {
        // given
        const init = {
            ...emptyInit,
            constrain: 'Collection' as any,
        }

        // then
        expect(() => factory(init)).toThrow()
    })

    it('throws when type is falsy', () => {
        // then
        expect(() => factory(emptyInit)).toThrow()
    })

    it('calls conditionFactory', () => {
        // given
        const init: StepConstraintInit = { ...emptyInit, constrain: 'Property' }

        // when
        factory(init)

        // then
        expect(conditionFactory).toHaveBeenCalledWith(init)
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
        expect(PropertyConstraint).toHaveBeenCalled()
    })

    it('calls StatusConstraint', () => {
        // given
        const init: StepConstraintInit = { ...emptyInit, constrain: 'Status' }

        // when
        factory(init)

        // then
        expect(StatusConstraint).toHaveBeenCalled()
    })
})
