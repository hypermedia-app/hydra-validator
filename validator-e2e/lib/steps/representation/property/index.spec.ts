import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { Resource } from 'alcaeus'
import { Hydra } from 'alcaeus/node'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import DatasetExt from 'rdf-ext/lib/Dataset'
import { literal, namedNode } from '@rdf-esm/data-model'
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
    }, [{} as any], [])

    // when
    const execute = propertyStatement.getRunner({} as any)
    const result = await execute.call(context)

    // then
    expect(result.result!.status).to.eq('error')
  })

  it('returns error when step has both constraints and value', async () => {
    // given
    const propertyStatement = new PropertyStep({
      propertyId: 'http://example.com/title',
      value: 'foo',
      strict: false,
    }, [], [{} as any])

    // when
    const execute = propertyStatement.getRunner({} as any)
    const result = await execute.call(context)

    // then
    expect(result.result!.status).to.eq('error')
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
    expect(result).to.eq(true)
  })

  describe('statement', () => {
    it('returns failure when values do not match', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        value: 'foo',
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), 'bar'))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('failure')
    })

    it('returns success when values match', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        value: 'foo',
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), 'foo'))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('success')
    })

    it('returns success when boolean false matches expectation', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'active',
        value: false,
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('active'), literal('false', xsd.boolean)))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('success')
    })

    it('returns success when number 0 matches expectation', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        value: 0,
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), literal('0', xsd.int)))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('success')
    })

    it('returns success when number expecting 0 but value is "0"', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        value: 0,
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), literal('0')))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('success')
    })

    it('returns success when number expecting false but value is "false"', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        value: false,
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), literal('false')))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('success')
    })

    it('returns success when empty string matches expectation', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        value: '',
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), literal('')))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('success')
    })

    it('returns failure when strict and property is missing', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        value: 'foo',
        strict: true,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(cf({ dataset }).blankNode())

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('failure')
    })

    it('returns informational when not strict and property is missing', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode())

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('informational')
    })

    it('returns success when comparing resource has expected rdf:type', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: expand('rdf:type'),
        value: 'http://example.com/Class',
        strict: true,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(rdf.type, namedNode('http://example.com/Class')))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('success')
    })

    it('returns success when resource does not have expected rdf:type', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: expand('rdf:type'),
        value: 'http://example.com/Class',
        strict: true,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode())

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('failure')
    })

    it('returns error when rdf:type statement is not strict', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: expand('rdf:type'),
        value: 'http://example.com/Class',
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode())

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('error')
    })

    it('runs check on array items and returns success if value is found', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        value: 'bar',
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), ['foo', 'bar', 'baz']))

      // when
      const arrayRunner = propertyStatement.getRunner(value)
      const { result } = await arrayRunner.call(context)

      // then
      expect(result!.status).to.eq('success')
    })

    it('runs check on array items and returns failure if matching value is not found', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'http://example.com/title',
        value: 'baz',
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), ['foo', 'bar']))

      // when
      const arrayRunner = propertyStatement.getRunner(value)
      const { result } = await arrayRunner.call(context)

      // then
      expect(result!.status).to.eq('failure')
    })

    it('returns success when expected value is not specified and property exists', async () => {
      // given
      const propertyStatement = new PropertyStep({
        propertyId: 'count',
        strict: false,
      }, [], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('count'), ''))

      // when
      const execute = propertyStatement.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('success')
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
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode())

      // when
      const execute = propertyBlock.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('failure')
    })

    it('returns informational when not strict and property is missing', async () => {
      // given
      const propertyBlock = new PropertyStep({
        propertyId: 'http://example.com/title',
        strict: false,
      }, [
        new StepStub('foo'),
      ], [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode())

      // when
      const execute = propertyBlock.getRunner(value)
      const result = await execute.call(context)

      // then
      expect(result.result!.status).to.eq('informational')
    })

    it('enqueues child steps and top-level steps in that order', async () => {
      // given
      const executions: string[] = []
      const childSteps = [
        new StepStub('step1', executions),
        new StepStub('step2', executions),
      ]
      context.scenarios.push(new StepStub('topLevel1', executions))
      context.scenarios.push(new StepStub('topLevel2', executions))
      const propertyBlock = new PropertyStep({
        propertyId: 'http://example.com/title',
        strict: false,
      }, childSteps, [])
      const value = Hydra.resources.factory.createEntity<Resource>(
        cf({ dataset })
          .blankNode()
          .addOut(namedNode('http://example.com/title'), 'hello'))

      // when
      const execute = propertyBlock.getRunner(value)
      await runAll(execute, context)

      // then
      expect(executions).to.include.all.members(
        ['step1', 'step2', 'topLevel1', 'topLevel2'],
      )
    })

    it('runs check on array items and returns success if any child step succeeds', async () => {
      // given
      const fooCheck = new StepSpy()
      fooCheck.runner.returns({ result: { status: 'success' } })
      const children = [
        fooCheck,
        fooCheck,
      ]
      const propertyBlock = new PropertyStep({
        propertyId: 'friend',
        strict: false,
      }, children, [])
      const value: any = {
        friend: ['foo', 'bar'],
      }

      // when
      const arrayRunner = propertyBlock.getRunner(value)
      const { result } = await arrayRunner.call(context)

      // then
      expect(fooCheck.runner).to.have.been.calledTwice
      expect(result!.status).to.equal('success')
    })

    it('runs check on array items and returns failure is no child check succeeds', async () => {
      // given
      const failedCheck = new StepSpy()
      failedCheck.runner.returns({ result: { status: 'failure' } })
      const successCheck = new StepSpy()
      successCheck.runner.returns({ result: { status: 'success' } })
      const children = [
        failedCheck,
        successCheck,
      ]
      const propertyBlock = new PropertyStep({
        propertyId: 'friend',
        strict: false,
      }, children, [])
      const value: any = {
        friend: ['foo', 'bar'],
      }

      // when
      const arrayRunner = propertyBlock.getRunner(value)
      const { result } = await arrayRunner.call(context)

      // then
      expect(failedCheck.runner).to.have.been.calledTwice
      expect(successCheck.runner).to.have.been.calledTwice
      expect(result!.status).to.eq('failure')
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
          new ConstraintMock(true, 'Representation'),
          new ConstraintMock(false, 'Representation'),
        ])
        const value = Hydra.resources.factory.createEntity<Resource>(
          cf({ dataset })
            .blankNode()
            .addOut(namedNode('http://example.com/title'), ['Rocky IV', 'Rocky V']))

        // when
        const execute = propertyBlock.getRunner(value)
        const result = await execute.call(context)

        // then
        expect(result.result!.status).to.eq('informational')
        expect(childStep.getRunner()).not.to.have.been.called
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
        const value = Hydra.resources.factory.createEntity<Resource>(
          cf({ dataset })
            .blankNode()
            .addOut(namedNode('http://example.com/title'), 'Rocky IV'))

        // when
        const execute = propertyBlock.getRunner(value)
        await runAll(execute)

        // then
        expect(childStep.getRunner()).to.have.been.called
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
        const value = Hydra.resources.factory.createEntity<Resource>(
          cf({ dataset })
            .blankNode()
            .addOut(namedNode('http://example.com/title'), ['Rocky IV', 'Rocky V']))

        // when
        const execute = propertyBlock.getRunner(value)
        await runAll(execute)

        // then
        expect(childStep.getRunner()).to.have.been.calledTwice
      })
    })
  })
})
