import { html, LitElement } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';


import { Options } from "@/types";

@customElement('noconflict-wrapper')
export class NoconflictWrapper extends LitElement {
  @property({ type: Object }) options: Options = {};

  @query('iframe')
  private _iframe!: HTMLIFrameElement;

  @state()
  private _iframeHeight = '150px'; // Initial height

  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(_changedProperties);
    this._iframe.addEventListener('load', () => {
      this._sendOptionsToIframe();
    });
    window.addEventListener('message', this._handleIframeMessage);
  }

  protected updated(_changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(_changedProperties);
    if (_changedProperties.has('options') && this._iframe?.contentWindow) {
      this._sendOptionsToIframe();
    }
  }

  private _sendOptionsToIframe() {
    if (this._iframe && this._iframe.contentWindow) {
      this._iframe.contentWindow.postMessage({ type: 'options', data: this.options }, '*');
    }
  }

  private _handleIframeMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'iframe-height') {
      const height = event.data.value;
      if (typeof height === 'number' && height > 0) {
        this._iframeHeight = `${height}px`;
      }
    }
  };

  render() {
    console.log('Options from noconflic-wrapper', this.options);
    return html`
      <p>No conflict wrapper!</p>
      <iframe
        src="./noconflict-wrapper.html"
        style="width: 100%; outline: 3px dotted blue; border: none; height: ${this._iframeHeight};"
      ></iframe>
    `;
  }
}