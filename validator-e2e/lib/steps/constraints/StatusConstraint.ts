import { ResponseConstraint } from './Constraint'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'

export class StatusConstraint extends ResponseConstraint {
    protected getValue (subject: IHydraResponse): number {
        return subject.xhr.status
    }

    protected sanityCheckValue (value: unknown): boolean {
        return value !== 0
    }
}
