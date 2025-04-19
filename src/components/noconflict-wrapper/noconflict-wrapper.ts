import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Options } from "@/types";

@customElement('noconflict-wrapper')
export class NoconflictWrapper extends LitElement {
  @property({ type: Object }) options: Options = {};

  render() {
    console.log('Options from noconflic-wrapper', this.options);
    return html`<p>No conflict wrapper!</p>`;
  }
}
