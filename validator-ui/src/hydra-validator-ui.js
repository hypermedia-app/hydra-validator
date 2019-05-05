import { LitElement, html } from 'lit-element';

class HydraValidatorUi extends LitElement {
	static get properties() {
		return {
			heading: { type: String },
		};
	}

	render() {
		return html`
			<h1>${this.heading}</h1>
		`;
	}
}

customElements.define('hydra-validator-ui', HydraValidatorUi);
