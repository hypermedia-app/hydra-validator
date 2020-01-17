import { PropertyStep } from '.'
import { E2eContext } from '../../../../types'
import { StepStub, StepSpy, ConstraintMock } from '../../stub'
import { expand } from '@zazuko/rdf-vocabularies'
import { runAll } from '../../../testHelpers'

describe('property step', () => {
  let context: E2eContext & any
  beforeEach(() => {
    context = {
      scenarios: [],
    }
  })

  it('returns error when step has both children and value', async () => {
    // given
    const propertyStatement = new PropertyStep({
      propertyId: 'title',
      value: 'foo',
      strict: false,
    }, [ {} as any ], [])

    // when
    const execute = propertyStatement.getRunner({} as any)
    const result = await execute.call(context)

    // then
    expect(result.result!.status).toBe('error')
  })

  it('returns error when step has both constraints and value', async () => {
    // given
    const propertyStatement = new PropertyStep({
      propertyId: 'title',
      value: 'foo',
      strict: false,
    }, [], [ {} as any ],)

    // when
    const execute = propertyStatement.getRunner({} as any)
    const result = await execute.call(context)

    // then
    expect(result.result!.status).toBe('error')
  })

  it('applies to hydra resource', () => {
    // given
    const propertyStatement = new PropertyStep({
      propertyId: 'title',
      value: 'foo',
      strict: false,
    }, [], [])

    // when
    const result = propertyStatement.appliesTo({
      id: 'id',
    } as any)

    // then
    expect(result).toBe(true)
  })

  describe('statement', () => {
    it('returns failure when values do not match', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'title',
        value: 'foo',
        strict: false,
      }, [], [])
      const value: any = {
        title: 'bar',
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('failure')
    })

    it('returns success when values match', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'title',
        value: 'foo',
        strict: false,
      }, [], [])
      const value: any = {
        title: 'foo',
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })

    it('returns success when boolean false matches expectation', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'active',
        value: false,
        strict: false,
      }, [], [])
      const value: any = {
        active: false,
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })

    it('returns success when number 0 matches expectation', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        value: 0,
        strict: false,
      }, [], [])
      const value: any = {
        count: 0,
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })

    it('returns success when number expecting 0 but value is "0"', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        value: 0,
        strict: false,
      }, [], [])
      const value: any = {
        count: '0',
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })

    it('returns success when number expecting false but value is "false"', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        value: false,
        strict: false,
      }, [], [])
      const value: any = {
        count: 'false',
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })

    it('returns success when empty string matches expectation', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        value: '',
        strict: false,
      }, [], [])
      const value: any = {
        count: '',
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })

    it('returns failure when strict and property is missing', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'title',
        value: 'foo',
        strict: true,
      }, [], [])
      const value: any = {
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('failure')
    })

    it('returns informational when not strict and property is missing', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'title',
        strict: false,
      }, [], [])
      const value: any = {}

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('informational')
    })

    it('returns success when comparing resource has expected rdf:type', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: expand('rdf:type'),
        value: 'http://example.com/Class',
        strict: true,
      }, [], [])
      const value = {
        types: {
          has: () => true,
        },
      }

      // when
      const execute = propertyStatement.getRunner(value as any)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })

    it('returns success when resource does not have expected rdf:type', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: expand('rdf:type'),
        value: 'http://example.com/Class',
        strict: true,
      }, [], [])
      const value = {
        types: {
          has: () => false,
        },
      }

      // when
      const execute = propertyStatement.getRunner(value as any)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('failure')
    })

    it('returns error when rdf:type statement is not strict', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: expand('rdf:type'),
        value: 'http://example.com/Class',
        strict: false,
      }, [], [])
      const value = {
        types: {
          contains: () => false,
        },
      }

      // when
      const execute = propertyStatement.getRunner(value as any)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('error')
    })

    it('runs check on each value of array', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'title',
        value: 'foo',
        strict: false,
      }, [], [])
      const value: any = {
        title: [ 'foo', 'bar' ],
      }

      // when
      const arrayRunner = propertyStatement.getRunner(value)
      const results = await runAll(arrayRunner)

      // then
      expect(results.length).toBe(5)
      expect(results.successes).toBe(1)
      expect(results.failures).toBe(1)
    })

    it('returns success when expected value is not specified and property exists', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        strict: false,
      }, [], [])
      const value: any = {
        count: '',
      }

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })
  })

  describe('block', () => {
    it('returns failure when strict and property is missing', async () => {
      // given
      const propertyBlock = new PropertyStep({
        propertyId: 'title',
        strict: true,
      }, [
        new StepStub('foo'),
      ], [])
      const value: any = {}

      // when
      const execute = propertyBlock.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('failure')
    })

    it('returns informational when not strict and property is missing', async () => {
      // given
      const propertyBlock = new PropertyStep({
        propertyId: 'title',
        strict: false,
      }, [
        new StepStub('foo'),
      ], [])
      const value: any = {}

      // when
      const execute = propertyBlock.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('informational')
    })

    it('enqueues child steps and top-level steps in that order', async () => {
      // given
      const childSteps = [
        new StepStub('step1'),
        new StepStub('step2'),
      ]
      context.scenarios.push(new StepStub('topLevel1'))
      context.scenarios.push(new StepStub('topLevel2'))
      const propertyBlock = new PropertyStep({
        propertyId: 'title',
        strict: false,
      }, childSteps, [])

      // when
      const execute = propertyBlock.getRunner({ title: 'hello' } as any)
      const result = await runAll(execute, context)

      // then
      expect(result.checkNames).toContain('step1')
      expect(result.checkNames).toContain('step2')
      expect(result.checkNames).toContain('topLevel1')
      expect(result.checkNames).toContain('topLevel2')
    })

    it('runs check on each value of array', async () => {
      // given
      const children = [
        new StepSpy(),
        new StepSpy(),
      ]
      const propertyStatement = new PropertyStep({
        propertyId: 'friend',
        strict: false,
      }, children, [])
      const value: any = {
        friend: [ 'foo', 'bar' ],
      }

      // when
      const arrayRunner = propertyStatement.getRunner(value)
      await runAll(arrayRunner)

      // then
      children.forEach(childStep => {
        expect(childStep.getRunner()).toHaveBeenCalledTimes(2)
      })
    })

    describe('when constrained', () => {
      it('does not run when any constraint fails', async () => {
        // given
        const childStep = new StepSpy()
        const propertyBlock = new PropertyStep({
          propertyId: 'title',
          strict: false,
        }, [
          childStep,
        ], [
          new ConstraintMock(true),
          new ConstraintMock(false),
        ])
        const value: any = {
          title: [ 'Rocky IV', 'Rocky V' ],
        }

        // when
        const execute = propertyBlock.getRunner(value)
        const result = await execute.call(context)

        // then
        expect(result.result!.status).toBe('informational')
        expect(childStep.getRunner()).not.toHaveBeenCalled()
      })

      it('do run when all constraint succeed', async () => {
        // given
        const childStep = new StepSpy()
        const propertyBlock = new PropertyStep({
          propertyId: 'title',
          strict: false,
        }, [
          childStep,
        ], [
          new ConstraintMock(true),
          new ConstraintMock(true),
        ])
        const value: any = {
          title: 'Rocky IV',
        }

        // when
        const execute = propertyBlock.getRunner(value)
        await runAll(execute)

        // then
        expect(childStep.getRunner()).toHaveBeenCalled()
      })

      it('do run for array when all constraint succeed', async () => {
        // given
        const childStep = new StepSpy()
        const propertyBlock = new PropertyStep({
          propertyId: 'title',
          strict: false,
        }, [
          childStep,
        ], [
          new ConstraintMock(true),
          new ConstraintMock(true),
        ])
        const value: any = {
          title: [ 'Rocky IV', 'Rocky V' ],
        }

        // when
        const execute = propertyBlock.getRunner(value)
        await runAll(execute)

        // then
        expect(childStep.getRunner()).toHaveBeenCalledTimes(2)
      })
    })
  })
})
