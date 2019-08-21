import { PropertyConstraint } from './PropertyConstraint'
import { HydraResource } from 'alcaeus/types/Resources'
import { StepConstraintInit } from './index'

describe('PropertyConstraint', () => {
    const nullResource: HydraResource = {} as any
    const emptyInit: StepConstraintInit = {} as any

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
        const result = constraint.satisfiedBy({
            ...nullResource,
            [property]: undefined,
        })

        // then
        expect(result).toBeFalsy()
        expect(predicate).not.toHaveBeenCalled()
    })

    it('does not pass when property is null', () => {
        // given
        const predicate = jest.fn()
        const property = 'http://example.com/prop'
        const init = {
            ...emptyInit,
            left: property,
        }
        const constraint = new PropertyConstraint(init, predicate, false)

        // when
        const result = constraint.satisfiedBy({
            ...nullResource,
            [property]: null,
        })

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
