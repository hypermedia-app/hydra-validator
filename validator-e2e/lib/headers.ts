import { E2eContext } from '../types'

export function buildHeaders(this: E2eContext, headers: Record<string, string[]>): Headers {
  return Object.entries(headers)
    .reduce((combined, [name, values]) => {
      if (Array.isArray(values) === false) {
        this.log && this.log.warning(`Skipping default header ${name}. Value was not the expected array`)
        return combined
      }

      values.forEach(value => {
        combined.append(name, value)
      })

      return combined
    }, new Headers())
}
