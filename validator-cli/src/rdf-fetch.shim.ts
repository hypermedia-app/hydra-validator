// @ts-ignore
import * as formats from '@rdfjs/formats-common'
// @ts-ignore
import * as rdf from 'rdf-ext'
// @ts-ignore
import * as stringToStream from 'string-to-stream'

async function dataset (this: Response) {
    const contentType = this.headers.get('content-type')
    if (!contentType) {
        throw new Error('Missing content-type header')
    }

    const quadStream = formats.parsers.import(
        contentType.split(';').shift(),
        stringToStream(await this.text()))

    const dataset = rdf.dataset()

    quadStream.on('data', (quad: any) => dataset.add(quad))

    return new Promise(resolve => {
        quadStream.on('end', () => {
            resolve(dataset)
        })
    })
}

export default {
    dataset,
}
