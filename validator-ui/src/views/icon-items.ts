import { html } from 'lit-html'
import { ifDefined } from 'lit-html/directives/if-defined'

function item ({ icon, color, description, details }) {
    import('@polymer/paper-item/paper-icon-item')
    import('@polymer/iron-icon/iron-icon')
    import('@polymer/iron-icons/iron-icons')
    import('@polymer/paper-item/paper-item-body')

    return html`
<paper-icon-item>
    <iron-icon icon="${icon}" style="color: ${color}" slot="item-icon"></iron-icon>
    <paper-item-body two-lines="${ifDefined(details)}">
        <div>${description}</div>
        ${details ? html`<div secondary>${details}</div>` : ''}
    </paper-item-body>
</paper-icon-item>`
}

export function warning (description, details?) {
  return item({
    description,
    details,
    color: 'orange',
    icon: 'report-problem'
  })
}

export function failure (description, details) {
  return item({
    description,
    details,
    icon: 'clear',
    color: 'red'
  })
}

export function success (description, details?) {
  return item({
    description,
    details,
    icon: 'check',
    color: 'darkgreen'
  })
}

export function information (description, details?) {
  return item({
    description,
    details,
    icon: 'lightbulb-outline',
    color: 'darkblue'
  })
}
