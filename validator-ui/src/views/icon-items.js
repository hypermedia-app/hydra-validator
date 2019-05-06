import { html } from 'lit-html'

function item ({ icon, color, description }) {
    import('@polymer/paper-item/paper-icon-item')
    import('@polymer/iron-icon/iron-icon')
    import('@polymer/iron-icons/iron-icons')

    return html`
<paper-icon-item>
    <iron-icon icon="${icon}" style="color: ${color}" slot="item-icon"></iron-icon>
    ${description}
</paper-icon-item>`
}

export function warning (description) {
  return item({
    description,
    color: 'orange',
    icon: 'report-problem'
  })
}

export function failure (description, details) {
    import('@polymer/paper-item/paper-icon-item')
    import('@polymer/paper-item/paper-item-body')
    import('@polymer/iron-icon/iron-icon')
    import('@polymer/iron-icons/iron-icons')

    return html`
<paper-icon-item>
    <iron-icon icon="clear" style="color: red" slot="item-icon"></iron-icon>
    <paper-item-body two-line>
        <div>${description}</div>
        <div secondary>${details}</div>
    </paper-item-body>
</paper-icon-item>`
}

export function success (description) {
  return item({
    description,
    icon: 'check',
    color: 'darkgreen'
  })
}

export function information (description) {
  return item({
    description,
    icon: 'lightbulb-outline',
    color: 'darkblue'
  })
}
