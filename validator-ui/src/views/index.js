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
  .valueMatches(v => v.message && v.message.status !== 'failure')
  .renders(check => {
    switch (check.message.status) {
      case 'informational':
        return item.information(check.message.description)
      case 'success':
        return item.success(check.message.description)
      default:
        return item.warning(check.message.description)
    }
  })

ViewTemplates.default.when
  .scopeMatches('result')
  .valueMatches(v => v.message && v.message.status === 'failure')
  .renders(check => {
    return item.failure(check.message.description, check.message.details)
  })
