import {Hydra} from '../../namespace';
import {checkChain, Result} from '../../check';

export default function (apiDoc: any): checkChain {
    return function () {
        const classes = apiDoc.out(Hydra.supportedClass)

        if (classes.values.length === 0) {
            return [
                Result.Warning('No SupportedClasses found')
            ]
        }

        return [
            Result.Success(`Found ${classes.values.length} Supported Classes`)
        ]
    }
}
