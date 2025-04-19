import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Options } from "@/types";

@customElement('highcharts-wrapper')
export class HighchartsWrapper extends LitElement {
    @property({ type: Object }) options: Options = {};
  
  render() {
    console.log('Options from highcharts-wrapper', this.options);
    return html`<p>Highcharts wrapper!</p>`;
  }
}
