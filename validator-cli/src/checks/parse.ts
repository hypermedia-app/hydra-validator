import {checkChain, Result} from '../check';

export default function (response: any): checkChain {
    return async function (): Promise<[ Result, Array<checkChain> ]> {
        const dataset = await response.dataset()

        return [
            Result.Success(`Successfully parsed ${dataset.length} triples`),
            []
        ]
    }
}
