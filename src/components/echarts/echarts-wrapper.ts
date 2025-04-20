import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Options } from "@/types";

@customElement('echarts-wrapper')
export class EchartsWrapper extends LitElement {
  static styles = css`
  :host {
    display: block;
    padding: 10px;
    background: orange
  }
`;
  @property({ type: Object }) options: Options = {};

  render() {
    console.log('Options from echarts-wrapper', this.options);
    return html`<p>Echarts wrapper!: ${this.options.title}</p>`;
  }
}
