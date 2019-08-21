import { StatusConstraint } from './StatusConstraint'

describe('StatusConstraint', () => {
    it('does not pass when status is 0', () => {
        // given
        const predicate = jest.fn()
        const constraint = new StatusConstraint(predicate, false)

        // when
        const result = constraint.satisfiedBy({
            xhr: {
                status: 0,
            },
        } as any)

        // then
        expect(result).toBeFalsy()
        expect(predicate).not.toHaveBeenCalled()
    })

    it('calls predicate when status code is within range', () => {
        // given
        const predicate = jest.fn().mockImplementation(() => true)
        const constraint = new StatusConstraint(predicate, false)

        // when
        const result = constraint.satisfiedBy({
            xhr: {
                status: 303,
            },
        } as any)

        // then
        expect(result).toBeTruthy()
        expect(predicate).toHaveBeenCalledWith(303)
    })
})
