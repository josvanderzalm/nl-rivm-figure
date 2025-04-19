import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Options } from "@/types";

@customElement('echarts-wrapper')
export class EchartsWrapper extends LitElement {
  @property({ type: Object }) options: Options = {};

  render() {
    console.log('Options from echarts-wrapper', this.options);
    return html`<p>Echarts wrapper!</p>`;
  }
}
