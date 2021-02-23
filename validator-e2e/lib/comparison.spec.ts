import areEqual from './comparison'
import { literal } from '@rdfjs/data-model'
import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'
import { Literal } from 'rdf-js'
import { expect } from 'chai'
import { describe, it } from 'mocha'

const xsd = namespace(prefixes.xsd)

describe('areEqual', () => {
  const equalPairs: [string | number | boolean, Literal][] = [
    [0, literal('0', xsd.int)],
    [0, literal('0')],
    ['0', literal('0')],
    [false, literal('false', xsd.boolean)],
    [false, literal('false')],
    [true, literal('true')],
    ['foo', literal('foo')],
  ]

  equalPairs.forEach(pair => {
    it(`${typeof pair[0]} ${pair[0]} should equal ${typeof pair[1]} ${pair[1]}`, () => {
      expect(areEqual(pair[0], pair[1])).to.be.ok
    })
  })

  const unequalPairs: [string | number | boolean, Literal][] = [
    [0, literal('1', xsd.int)],
    [0, literal('1')],
    [false, literal('true', xsd.boolean)],
    [false, literal('true')],
    [true, literal('false')],
    ['foo', literal('bar')],
  ]

  unequalPairs.forEach(pair => {
    it(`${typeof pair[0]} ${pair[0]} should not equal ${typeof pair[1]} ${pair[1]}`, () => {
      expect(areEqual(pair[0], pair[1])).not.to.be.ok
    })
  })
})
