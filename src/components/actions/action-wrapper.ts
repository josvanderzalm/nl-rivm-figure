import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('actions-wrapper')
export class Actions extends LitElement {
  render() {
    return html`
      <a href="">Tabel</a> | <a href="">Exporteer</a> 
    `;
  }
}
