import { SpyMixin } from './StepSpyMixin'
import { ScenarioStep } from './index'
import { expect } from 'chai'
import { describe, it } from 'mocha'

class TestStep extends ScenarioStep {
  public constructor() {
    super([])
  }

  protected appliesToInternal(): boolean {
    return true
  }

  public getRunner() {
    return () => ({})
  }
}

class TestStepLike extends SpyMixin(TestStep) {
}

describe('StepSpyMixin', () => {
  it('does not mark as visited when runner is created', () => {
    // given
    const step = new TestStepLike()

    // when
    step.getRunner()

    // then
    expect(step.visited).to.eq(false)
  })

  it('marks as when runner is invoked', async () => {
    // given
    const step = new TestStepLike()
    const runner = step.getRunner()

    // when
    await runner.call({})

    // then
    expect(step.visited).to.eq(true)
  })
})
