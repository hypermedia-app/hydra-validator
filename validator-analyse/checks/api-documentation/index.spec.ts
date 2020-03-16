jest.mock('./ensure-single-resource')

import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { Hydra, rdf } from 'hydra-validator-core/namespace'
import check from './index'
import ensureSingleNode from './ensure-single-resource'

describe('api-documentation', () => {
  test('should pass ApiDocumentation node to subsequent check', () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset() })
    graph.node('urn:api:doc').addOut(rdf.type, Hydra.ApiDocumentation)

    // when
    check(graph)

    // then
    const callArg = (ensureSingleNode as any).mock.calls[0][0]
    expect(callArg.value).toEqual('urn:api:doc')
  })
})
