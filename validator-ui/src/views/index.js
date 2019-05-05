import ViewTemplates from '@lit-any/lit-any/views'
import { asyncAppend } from 'lit-html/directives/async-append'
import { html } from 'lit-html'

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
        import('@polymer/paper-item/paper-icon-item')
        import('@polymer/iron-icon/iron-icon')
        import('@polymer/iron-icons/iron-icons')

        let icon, color
        switch (check.result.status) {
          case 'informational':
            icon = 'lightbulb-outline'
            color = 'darkblue'
            break
          case 'success':
            icon = 'check'
            color = 'darkgreen'
            break
          default:
            icon = 'report-problem'
            color = 'orange'
            break
        }

        return html`
<paper-icon-item>
    <iron-icon icon="${icon}" style="color: ${color}" slot="item-icon"></iron-icon>
    ${check.result.description}
</paper-icon-item>`
  })

ViewTemplates.default.when
  .scopeMatches('result')
  .valueMatches(v => v.result && v.result.status === 'failure')
  .renders(check => {
        import('@polymer/paper-item/paper-icon-item')
        import('@polymer/paper-item/paper-item-body')
        import('@polymer/iron-icon/iron-icon')
        import('@polymer/iron-icons/iron-icons')

        return html`
<paper-icon-item>
    <iron-icon icon="clear" style="color: red" slot="item-icon"></iron-icon>
    <paper-item-body two-line>
        <div>${check.result.description}</div>
        <div secondary>${check.result.details}</div>
    </paper-item-body>
</paper-icon-item>`
  })
