import { LitElement, css } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property, state } from 'lit/decorators.js';

import '@/components/actions/action-wrapper.js';

import { Options } from "@/types";

@customElement('nl-rivm-figure')
export class NlRivmFigure extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 10px;
      margin: 10px;
      background: lightgray;
    }
  `;

  @property({ type: Object }) options: Options = {};

  @state() private _isWrapperReady = false;

  get library(): 'highcharts' | 'echarts' {
    return this.options?.library === 'echarts' ? 'echarts' : 'highcharts';
  }

  get childComponent(): string {
    return this.options?.noconflict ? 'noconflict' : this.library;
  }

  get title(): string {
    return this.options?.title || '';
  }

  get subtitle(): string {
    return this.options?.subtitle || '';
  }

  protected async updated(changed: Map<string, unknown>) {
    if (changed.has('options') && this.options && !this._isWrapperReady) {
      await this.loadWrapperDynamically();
      this._isWrapperReady = true;
    }
  }

  private async loadWrapperDynamically() {
    switch (this.childComponent) {
      case 'noconflict':
        await import('@/components/noconflict-wrapper/noconflict-wrapper.js');
        break;
      case 'echarts':
        await import('@/components/echarts/echarts-wrapper.js');
        break;
      case 'highcharts':
      default:
        await import('@/components/highcharts/highcharts-wrapper.js');
        break;
    }
  }

  render() {
    if (!this._isWrapperReady) {
      return staticHtml`<p>Loading chart wrapper…</p>`;
    }

    const tagName = unsafeStatic(`${this.childComponent}-wrapper`);

    return staticHtml`
      <h1>${this.title}</h1>
      <h2>${this.subtitle}</h2>
      <${tagName} .options="${this.options}"></${tagName}>
      <actions-wrapper></actions-wrapper>
    `;
  }
}
