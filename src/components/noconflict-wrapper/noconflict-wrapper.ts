import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js'; // Correct import for @query

import { Options } from "@/types";

@customElement('noconflict-wrapper')
export class NoconflictWrapper extends LitElement {
  @property({ type: Object }) options: Options = {};

  @query('iframe')
  private _iframe!: HTMLIFrameElement;

  private _iframeLoaded = false;

  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(_changedProperties);
    this._iframe.addEventListener('load', () => {
      this._iframeLoaded = true;
      this._sendOptionsToIframe();
    });
  }

  protected updated(_changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(_changedProperties);
    if (this._iframeLoaded && _changedProperties.has('options')) {
      this._sendOptionsToIframe();
    }
  }

  private _sendOptionsToIframe() {
    if (this._iframe && this._iframe.contentWindow) {
      this._iframe.contentWindow.postMessage({ type: 'options', data: this.options }, '*');
    }
  }

  render() {
    console.log('Options from noconflic-wrapper', this.options);
    return html`
      <p>No conflict wrapper!</p>
      <iframe
        src="./noconflict-wrapper.html"
        style="width: 100%; border: 1px solid blue;"
      ></iframe>
    `;
  }
}