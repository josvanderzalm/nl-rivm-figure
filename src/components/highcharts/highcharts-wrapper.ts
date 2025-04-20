import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Options } from '@/types';

import Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import 'highcharts/modules/exporting';
import 'highcharts/modules/offline-exporting';
import 'highcharts/modules/drilldown';
import 'highcharts/modules/export-data';

const dateStringToTimestamp = (dateString: string): number | string => {
  const parsedDateString = Date.parse(dateString);
  return isNaN(parsedDateString) ? dateString : parsedDateString;
};

async function generateHighchartsOptions(options: Options): Promise<Highcharts.Options | null> {
  try {
    let data = options.data;

    if (!data && options['data-url']) {
      const response = await fetch(options['data-url'], options['fetch-options'] || {});
      data = await response.json();
    }

    return {
      chart: {
        type: options.type || 'line',
        animation: options.animation !== undefined ? options.animation : false,
        width: options.width === '100%' ? null : parseInt(options.width as string, 10),
        height: parseInt(options.height as string, 10) || 400,
      },
      plotOptions: {
        series: {
          animation: options.animation !== undefined ? options.animation : false,
        },
      },
      title: {
        text: options.title || '',
      },
      subtitle: {
        text: options.subtitle || '',
      },
      xAxis: {
        type: options['x-axis']?.type || 'datetime',
        title: {
          text: options['x-axis']?.title || '',
        },
        plotBands:
          options['x-axis']?.zones?.map((zone) => ({
            from: dateStringToTimestamp(zone.from),
            to: dateStringToTimestamp(zone.to),
            color: 'rgba(200, 200, 200, 0.2)', // Light gray background
            label: {
              text: zone.label,
              style: {
                color: '#666',
                fontSize: '10px',
              },
            },
          })) || [],
      },
      yAxis: {
        title: {
          text: options['y-axis']?.title || '',
        },
      },
      tooltip: options.tooltip || {},
      legend: options.legend || false,
      series: [
        {
          name: options['y-key'] || 'Data',
          data: data.map((item: Record<string, any>) => {
            const x =
              options['x-axis']?.type === 'datetime'
                ? dateStringToTimestamp(item[options['x-key']])
                : item[options['x-key']];
            const y =
              options['y-axis']?.type === 'datetime'
                ? dateStringToTimestamp(item[options['y-key']])
                : item[options['y-key']];
            return [x, y];
          }),
        },
      ],
      exporting: {
        enabled: options.exportable !== undefined ? options.exportable : true,
      },
      credits: {
        enabled: true,
        text: options.source || '',
        href: options['source-url'] || '',
      },
    };
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    return null;
  }
}

@customElement('highcharts-wrapper')
export class HighchartsWrapper extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 10px;
      background: lightblue;
    }
  `;

  @property({ type: Object }) options: Options = {};

  private chart: Highcharts.Chart | null = null;

  async firstUpdated(): Promise<void> {
    const options = this.options;

    const highchartsOptions = await generateHighchartsOptions(options);

    if (highchartsOptions) {
      this.chart = Highcharts.chart(
        this.shadowRoot?.querySelector('.rivm-hc-chart') as HTMLElement,
        highchartsOptions
      );
    }
  }

  render() {
    return html`<div class="rivm-hc-chart"></div>`;
  }
}