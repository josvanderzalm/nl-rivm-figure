import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Options } from "@/types";

@customElement('highcharts-wrapper')
export class HighchartsWrapper extends LitElement {
    static styles = css`
      :host {
        display: block;
        padding: 10px;
        background: lightblue
      }
    `;
    @property({ type: Object }) options: Options = {};
  
  render() {
    console.log('Options from highcharts-wrapper', this.options);
    return html`<p>Highcharts wrapper!: ${this.options.title}</p>`;
  }
}
