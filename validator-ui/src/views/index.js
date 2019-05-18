import ViewTemplates from '@lit-any/lit-any/views'
import { asyncAppend } from 'lit-html/directives/async-append'
import { html } from 'lit-html'
import * as item from './icon-items'

ViewTemplates.default.when
  .scopeMatches('hydrofoil-shell')
  .renders((model, next) => {
    return html`
<div role="listbox">
    ${asyncAppend(model, v => next(v, 'result'))}
</div>`
  })

ViewTemplates.default.when
  .scopeMatches('result')
  .valueMatches(v => v.result && v.result.status !== 'failure')
  .renders(check => {
    switch (check.result.status) {
      case 'informational':
        return item.information(check.result.description, check.result.details)
      case 'success':
        return item.success(check.result.description, check.result.details)
      default:
        return item.warning(check.result.description, check.result.details)
    }
  })

ViewTemplates.default.when
  .scopeMatches('result')
  .valueMatches(v => v.result && v.result.status === 'failure')
  .renders(check => {
    console.error(check.result.details)

    return item.failure(check.result.description, check.result.details)
  })
