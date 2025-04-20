import { LitElement, html, css} from 'lit';
import { customElement,property } from 'lit/decorators.js';
import { createTable, Table } from '@tanstack/lit-table';

@customElement('data-table')
export class DataTable extends LitElement {
  @property({ type: String }) title: string = '';
  @property({ type: Number }) maxRows: number = 10;
  @property({ type: Array }) data: Array<Record<string, any>> = [];

  private table: Table | null = null;

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      cursor: pointer;
      background-color: #f4f4f4;
    }

    .pagination {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pagination button {
      padding: 5px 10px;
      cursor: pointer;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.initializeTable();
  }

  initializeTable() {
    this.table = createTable({
      data: this.data,
      columns: Object.keys(this.data[0] || {}).map((key) => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        cell: (info) => info.getValue(),
      })),
      state: {
        pagination: { pageSize: this.maxRows, pageIndex: 0 },
      },
    });
  }

  renderTable() {
    if (!this.table) return html``;

    const { rows, pageCount, state } = this.table.getPaginationRowModel();
    const { pageIndex } = state.pagination;

    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              ${this.table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map(
                  (header) => html`
                    <th @click=${() => header.column.toggleSorting()}>
                      ${header.renderHeader()}
                      ${header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                    </th>
                  `
                )
              )}
            </tr>
          </thead>
          <tbody>
            ${rows.map(
              (row) => html`
                <tr>
                  ${row.getVisibleCells().map((cell) => html`<td>${cell.renderCell()}</td>`)}
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button ?disabled=${pageIndex === 0} @click=${() => this.table.previousPage()}>Previous</button>
        <span>Page ${pageIndex + 1} of ${pageCount}</span>
        <button ?disabled=${pageIndex === pageCount - 1} @click=${() => this.table.nextPage()}>Next</button>
      </div>
    `;
  }

  render() {
    return html`
      <div>
        <h2>${this.title}</h2>
        ${this.renderTable()}
      </div>
    `;
  }
}