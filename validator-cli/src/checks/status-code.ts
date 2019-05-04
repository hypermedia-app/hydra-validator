import {Either, Maybe, Writer} from 'tsmonad'
import {Response} from 'node-fetch';

export default (response: Response, result: boolean): Writer<string, boolean> => {
    const story = []
    if(!response.ok) {
        story.push('Invalid response')
    } else {
        story.push('Success')
    }

    return Writer.writer(story, result && response.ok)
}
