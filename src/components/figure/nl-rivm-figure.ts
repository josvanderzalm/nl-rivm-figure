import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@/components/actions/action-wrapper.js';
import '@/components/figure/figure-wrapper.js';
import '@/components/noconflict-wrapper/noconflict-wrapper.js';

import { Options } from "@/types";

@customElement('nl-rivm-figure')
export class NlRivmFigure extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 10px;
      margin: 10px;
      background: yellow;
    }
  `;

  @property({ type: Object }) options: Options = {};

  get childComponent(): string {
    return this.options?.noconflict ? 'noconflict' : 'figure';
  }

  get title(): string {
    return this.options?.title || '';
  }

  get subtitle(): string {
    return this.options?.subtitle || '';
  }

  componentTemplate() {
    if (this.childComponent === 'figure') {
      return html`<figure-wrapper .options="${this.options}"></figure-wrapper>`;
    }
    if (this.childComponent === 'noconflict') {
      return html`<noconflict-wrapper .options="${this.options}"></noconflict-wrapper>`;
    } 
  }

  render() {
    return html`
      <h1>${this.title}</h1>
      <h2>${this.subtitle}</h2>
      ${this.componentTemplate()}
      <actions-wrapper></actions-wrapper>
    `;
  }
}
