import { ResponseConstraint } from './Constraint'
import { HydraResponse } from 'alcaeus/types/HydraResponse'

export class StatusConstraint extends ResponseConstraint {
  protected getValue(subject: HydraResponse): number {
    return subject.xhr.status
  }

  protected sanityCheckValue(value: unknown): boolean {
    return value !== 0
  }
}
