import { LitElement, html, css } from 'lit-element'
import './validator-shell'
import * as item from './views/icon-items'

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
<validator-shell use-hash-urls>
  <h1>Hydra validator</h1>
  <p>This page let's authors run a set of tests against their Hydra server.</p>
  
  <h2>Usage</h2>
  <p>Type of paste an URL to verify in the address bar above and press ENTER</p>
  
  <h2>The results</h2>
  <p>Results will be presented as a simple list. Each has of four possible outcomes:</p>
  
  <div role="listbox">
    ${item.success('Successful check. All good!')}
    ${item.information('Additional piece of information to help understand the results')}
    ${item.warning('Non-critical issue. It may pose problems if not handled correctly by clients')}
    ${item.failure('A failed check', 'More details shown on second line')}
  </div>
</validator-shell>
        `
  }
}

customElements.define('hydra-validator-ui', HydraValidatorUi)
