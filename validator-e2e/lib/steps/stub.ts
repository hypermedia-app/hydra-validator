import { ScenarioStep } from './index'
import { checkChain } from 'hydra-validator-core'
import { Constraint } from './constraints/Constraint'
// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon'

export class StepStub extends ScenarioStep {
  private readonly runner: checkChain
  private readonly executions: string[]
  private readonly name: string
  public visited = false

  public constructor(name: string, executions: string[] = []) {
    super([])

    this.name = name
    this.executions = executions
    // eslint-disable-next-line no-new-func
    this.runner = new Function(
      `return function ${name}() { return {} }`,
    )()
  }

  protected appliesToInternal(): boolean {
    return true
  }

  public getRunner() {
    this.executions.push(this.name)
    return this.runner
  }
}

export class StepSpy extends ScenarioStep {
  public readonly runner: sinon.SinonStub
  public readonly realAppliesTo: sinon.SinonStub

  public constructor() {
    super([])
    this.realAppliesTo = sinon.stub().returns(true)
    this.runner = sinon.stub().returns(() => ({ }))
  }

  public appliesTo(obj: unknown): boolean {
    return this.realAppliesTo(obj)
  }

  public getRunner() {
    return this.runner
  }

  protected appliesToInternal(): boolean {
    throw new Error('Not implemented')
  }
}

export class ConstraintMock extends Constraint<unknown> {
  public type: 'Representation' | 'Response' | null

  public constructor(mockResult = true, type?: 'Representation' | 'Response') {
    super(() => mockResult, false)

    this.type = type || null
  }

  protected getValue(subject: unknown): unknown {
    return undefined
  }

  protected sanityCheckValue(value: unknown): boolean {
    return true
  }
}
