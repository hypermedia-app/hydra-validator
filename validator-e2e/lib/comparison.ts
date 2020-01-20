import { Literal } from 'rdf-js'

export default function areEqual(expected: unknown, actual: Literal) {
  if (typeof expected === 'boolean') {
    return expected.toString() === actual.value.toString()
  }

  // eslint-disable-next-line eqeqeq
  return expected == actual.value
}
