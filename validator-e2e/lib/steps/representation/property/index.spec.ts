import Hydra, { HydraResource } from 'alcaeus'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import DatasetExt from 'rdf-ext/lib/Dataset'
import { literal, namedNode } from '@rdfjs/data-model'
import namespace from '@rdfjs/namespace'
import { PropertyStep } from '.'
import { E2eContext } from '../../../../types'
import { StepStub, StepSpy, ConstraintMock } from '../../stub'
import { prefixes, expand } from '@zazuko/rdf-vocabularies'
import { runAll } from '../../../testHelpers'

const xsd = namespace(prefixes.xsd)
const rdf = namespace(prefixes.rdf)

describe('property step', () => {
  let dataset: DatasetExt

  beforeEach(() => {
    dataset = $rdf.dataset()
  })

  let context: E2eContext & any
  beforeEach(() => {
    context = {
      scenarios: [],
    }
  })

  it('returns error when step has both children and value', async () => {
    // given
    const propertyStatement = new PropertyStep({
      propertyId: 'http://example.com/title',
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
      propertyId: 'http://example.com/title',
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
      propertyId: 'http://example.com/title',
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
        propertyId: 'http://example.com/title',
        value: 'foo',
        strict: false,
      }, [], [])
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), 'bar'))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('failure')
    })

    it('returns success when values match', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        value: 'foo',
        strict: false,
      }, [], [])
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), 'foo'))

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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('active'), literal('false', xsd.boolean)))

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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), literal('0', xsd.int)))

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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), literal('0')))

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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), literal('false')))

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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), literal('')))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('success')
    })

    it('returns failure when strict and property is missing', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        value: 'foo',
        strict: true,
      }, [], [])
      const value = Hydra.factory.createEntity<HydraResource>(cf({ dataset }).blankNode())

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('failure')
    })

    it('returns informational when not strict and property is missing', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        strict: false,
      }, [], [])
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode())

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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(rdf.type, namedNode('http://example.com/Class')))

      // when
      const execute = propertyStatement.getRunner(value)
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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode())

      // when
      const execute = propertyStatement.getRunner(value)
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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode())

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('error')
    })

    it('runs check on each value of array', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        value: 'foo',
        strict: false,
      }, [], [])
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), ['foo', 'bar']))

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
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), ''))

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
        propertyId: 'http://example.com/title',
        strict: true,
      }, [
        new StepStub('foo'),
      ], [])
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode())

      // when
      const execute = propertyBlock.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).toBe('failure')
    })

    it('returns informational when not strict and property is missing', async () => {
      // given
      const propertyBlock = new PropertyStep({
        propertyId: 'http://example.com/title',
        strict: false,
      }, [
        new StepStub('foo'),
      ], [])
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode())

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
        propertyId: 'http://example.com/title',
        strict: false,
      }, childSteps, [])
      const value = Hydra.factory.createEntity<HydraResource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), 'hello'))

      // when
      const execute = propertyBlock.getRunner(value)
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
          propertyId: 'http://example.com/title',
          strict: false,
        }, [
          childStep,
        ], [
          new ConstraintMock(true),
          new ConstraintMock(false),
        ])
        const value = Hydra.factory.createEntity<HydraResource>(
          cf({ dataset })
            .blankNode()
            .addOut(namedNode('http://example.com/title'), ['Rocky IV', 'Rocky V']))

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
          propertyId: 'http://example.com/title',
          strict: false,
        }, [
          childStep,
        ], [
          new ConstraintMock(true),
          new ConstraintMock(true),
        ])
        const value = Hydra.factory.createEntity<HydraResource>(
          cf({ dataset })
            .blankNode()
            .addOut(namedNode('http://example.com/title'), 'Rocky IV'))

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
          propertyId: 'http://example.com/title',
          strict: false,
        }, [
          childStep,
        ], [
          new ConstraintMock(true),
          new ConstraintMock(true),
        ])
        const value = Hydra.factory.createEntity<HydraResource>(
          cf({ dataset })
            .blankNode()
            .addOut(namedNode('http://example.com/title'), ['Rocky IV', 'Rocky V']))

        // when
        const execute = propertyBlock.getRunner(value)
        await runAll(execute)

        // then
        expect(childStep.getRunner()).toHaveBeenCalledTimes(2)
      })
    })
  })
})
