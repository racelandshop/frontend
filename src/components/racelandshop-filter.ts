import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { Filter } from "../data/common";
import { Racelandshop } from "../data/racelandshop";
import { RacelandshopStyles } from "../styles/racelandshop-common-style";
import "./racelandshop-checkbox";

@customElement("racelandshop-filter")
export class RacelandshopFilter extends LitElement {
  @property({ attribute: false }) public filters: Filter[];
  @property({ attribute: false }) public racelandshop: Racelandshop;

  protected async firstUpdated() {
    this.addEventListener("checkbox-change", (e) => this._filterClick(e));
  }

  protected render(): TemplateResult | void {
    return html`
      <div class="filter">
        ${this.filters?.map(
          (filter) => html`
            <racelandshop-checkbox
              class="checkbox"
              .label=${this.racelandshop.localize(`common.${filter.id}`) || filter.value}
              .id=${filter.id}
              .checked=${filter.checked || false}
            />
            </racelandshop-checkbox>`
        )}
      </div>
    `;
  }

  private _filterClick(ev): void {
    const filter = ev.detail;
    this.dispatchEvent(
      new CustomEvent("filter-change", {
        detail: {
          id: filter.id,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  static get styles(): CSSResultGroup {
    return [
      RacelandshopStyles,
      css`
        .filter {
          display: flex;
          border-bottom: 1px solid var(--divider-color);
          align-items: center;
          font-size: 16px;
          height: 32px;
          line-height: 4px;
          background-color: var(--sidebar-background-color);
          padding: 0 16px;
          box-sizing: border-box;
        }

        .checkbox:not(:first-child) {
          margin-left: 20px;
        }
      `,
    ];
  }
}
