import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@/components/actions/action-wrapper.js";

import { Options } from "@/types";

@customElement("figure-wrapper")
export class FigureWrapper extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 10px;
      background: lightgray;
      all: unset;
    }
  `;

  @property({ type: Object }) options: Options = {};

  @state() private _isWrapperReady = false;

  get library(): "highcharts" | "echarts" {
    return this.options?.library === "echarts" ? "echarts" : "highcharts";
  }

  get title(): string {
    return this.options?.title || "";
  }

  get subtitle(): string {
    return this.options?.subtitle || "";
  }

  componentTemplate() {
    if (this.library === "highcharts") {
      return html`<highcharts-wrapper
        .options="${this.options}"
      ></highcharts-wrapper>`;
    }
    if (this.library === "echarts") {
      return html`<echarts-wrapper
        .options="${this.options}"
      ></echarts-wrapper>`;
    }
  }

  protected async updated(changed: Map<string, unknown>) {
    if (changed.has("options") && this.options && !this._isWrapperReady) {
      await this.loadWrapperDynamically();
      this._isWrapperReady = true;
    }
  }

  private async loadWrapperDynamically() {
    switch (this.library) {
      case "echarts":
        await import("@/components/echarts/echarts-wrapper.js");
        break;
      case "highcharts":
      default:
        await import("@/components/highcharts/highcharts-wrapper.js");
        break;
    }
  }

  render() {
    if (!this._isWrapperReady) {
      return html`<p>Loading chart wrapper…</p>`;
    }
    if (this.library === "highcharts") {
      return html`<highcharts-wrapper
        .options="${this.options}"
      ></highcharts-wrapper>`;
    }
    if (this.library === "echarts") {
      return html`<echarts-wrapper
        .options="${this.options}"
      ></echarts-wrapper>`;
    }
  }
}
