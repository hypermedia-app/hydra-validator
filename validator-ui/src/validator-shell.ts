import { HydrofoilShell } from '@hydrofoil/hydrofoil-shell/hydrofoil-shell'
import '@hydrofoil/hydrofoil-paper-shell/hydrofoil-address-bar'
import '@polymer/paper-input/paper-input'
import '@polymer/iron-icon/iron-icon'
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/app-layout/app-toolbar/app-toolbar'
import '@polymer/app-layout/app-header/app-header'
import '@polymer/app-layout/app-header-layout/app-header-layout'
import { html } from 'lit-html'
import fireNavigation from 'ld-navigation/fireNavigation'
import './views'
import { css } from 'lit-element'

function navigate(this: any, e) {
  fireNavigation(this, e.target.url)
}

export default class ValidatorShell extends HydrofoilShell {
  constructor() {
    super()
    this.url = ''
  }

  static get styles() {
    return css`
        app-toolbar, ::slotted(app-toolbar) {
          background: var(--paper-indigo-400);
          color: white;
        }`
  }

  home() {
    this.url = ''
    this.state = 'ready'
  }

  renderTop() {
    return html`
<app-header-layout>
    <app-header slot="header" fixed condenses effects="waterfall">
        <app-toolbar>
            <paper-icon-button icon="home" @click="${this.home}"></paper-icon-button>
            <hydrofoil-address-bar
                main-title
                url="${this.url}"
                label="Enter URL to analyze and press ENTER"
                @resource-confirmed="${navigate}">
            </hydrofoil-address-bar>
        </app-toolbar>
    </app-header>
</app-header-layout>`
  }

  renderMain() {
    if (this.state === 'ready') {
      return html`${this.renderTop()}<slot></slot>`
    }

    if (this.state === 'error') {
      return html`${this.renderTop()} ${this.lastError}`
    }

    return html`
${this.renderTop()}
${super.renderMain()}`
  }

  async loadResourceInternal(url) {
    const [{ runChecks }, firstCheck] = await Promise.all([
      import('hydra-validator-core/run-checks'),
      import('hydra-validator-analyse/checks/url-resolvable'),
    ])

    return runChecks(firstCheck.default(url))
  }
}

customElements.define('validator-shell', ValidatorShell)
