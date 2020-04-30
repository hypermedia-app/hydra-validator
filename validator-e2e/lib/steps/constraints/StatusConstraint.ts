import { ResponseConstraint } from './Constraint'
import { HydraResponse } from 'alcaeus'

export class StatusConstraint extends ResponseConstraint {
  protected getValue(subject: HydraResponse): number {
    return subject.response?.xhr.status || 0
  }

  protected sanityCheckValue(value: unknown): boolean {
    return value !== 0
  }
}
