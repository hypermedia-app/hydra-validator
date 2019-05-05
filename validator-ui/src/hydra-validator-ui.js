import { LitElement, html, css } from 'lit-element'
import './validator-shell'

class HydraValidatorUi extends LitElement {
  static get styles () {
    return css`
validator-shell {
  max-width: 750px;
  margin: 0 auto;
}`
  }

  render () {
    return html`
            <validator-shell use-hash-urls></validator-shell>
        `
  }
}

customElements.define('hydra-validator-ui', HydraValidatorUi)
