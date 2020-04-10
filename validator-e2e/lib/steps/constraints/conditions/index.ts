/* eslint-disable no-new-func */
import { StepConstraintInit } from '../'

function equality(expected: unknown) {
  return function equalityPredicate(value: unknown) {
    return value === expected
  }
}

function inequality(operator: string, expected: unknown): () => boolean {
  return new Function('value', `return value ${operator} ${expected}`) as any // eslint-disable-line no-new-func
}

function regex(regex: RegExp) {
  return function regexPredicate(value: string) {
    return regex.test(value)
  }
}

export function factory(init: StepConstraintInit): (value: any) => boolean {
  const expected = init.right

  switch (init.operator) {
    case 'regex':
      return regex(new RegExp(init.right as string))
    case 'eq':
      return equality(expected)
    case 'gt':
      return inequality('>', expected)
    case 'ge':
      return inequality('>=', expected)
    case 'lt':
      return inequality('<', expected)
    case 'le':
      return inequality('<=', expected)
    case 'function':
      return eval(`${init.right}`) // eslint-disable-line no-eval
    default:
      throw new Error(`Unexpected constraint operator ${init.operator}`)
  }
}
