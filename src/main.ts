import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-container')
export class AppContainer extends LitElement {
  static styles = css`
  :host {
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 24px;
    box-sizing: border-box;
  }
  `

  render () {
    return html`
    <keyboard-simon></keyboard-simon>
    `
  }
}