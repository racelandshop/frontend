import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu";
import "@polymer/paper-listbox/paper-listbox";
import memoizeOne from "memoize-one";
import { customElement, html, TemplateResult, css, property, PropertyValues } from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import { HacsDialogBase } from "./hacs-dialog-base";
import { Repository } from "../../data/common";
import { mdiGithub } from "@mdi/js";
import { localize } from "../../localize/localize";
import { sectionsEnabled, activePanel } from "../../panels/hacs-sections";
import { filterRepositoriesByInput } from "../../tools/filter-repositories-by-input";
import { searchStyles, scrollBarStyle } from "../../styles/element-styles";
import "../hacs-chip";
import "../hacs-filter";
import { hacsIcon } from "../hacs-icon";
import "../../../homeassistant-frontend/src/common/search/search-input";
import "../../../homeassistant-frontend/src/components/ha-svg-icon";

@customElement("hacs-add-repository-dialog")
export class HacsAddRepositoryDialog extends HacsDialogBase {
  @property({ attribute: false }) public filters: any = [];
  @property({ type: Number }) private _load: number = 30;
  @property({ type: Number }) private _top: number = 0;
  @property() private _searchInput: string = "";
  @property() private _sortBy: string = "stars";
  @property() public section!: string;

  shouldUpdate(changedProperties: PropertyValues) {
    changedProperties.forEach((_oldValue, propName) => {
      if (propName === "hass") {
        this.sidebarDocked = window.localStorage.getItem("dockedSidebar") === '"docked"';
      }
    });
    return (
      changedProperties.has("narrow") ||
      changedProperties.has("filters") ||
      changedProperties.has("active") ||
      changedProperties.has("_searchInput") ||
      changedProperties.has("_load") ||
      changedProperties.has("_sortBy")
    );
  }

  private _repositoriesInActiveCategory = (repositories: Repository[], categories: string[]) =>
    repositories?.filter(
      (repo) =>
        !repo.installed &&
        sectionsEnabled(this.hacs.configuration)
          .find((section) => section.id === this.section)
          .categories?.includes(repo.category) &&
        !repo.installed &&
        categories?.includes(repo.category)
    );

  protected async firstUpdated() {
    this.addEventListener("filter-change", (e) => this._updateFilters(e));
    if (this.filters?.length === 0) {
      const categories = activePanel(this.route)?.categories;
      categories
        ?.filter((c) => this.hacs.configuration?.categories.includes(c))
        .forEach((category) => {
          this.filters.push({
            id: category,
            value: category,
            checked: true,
          });
        });
      this.requestUpdate("filters");
    }
  }

  private _updateFilters(e) {
    const current = this.filters.find((filter) => filter.id === e.detail.id);
    this.filters.find((filter) => filter.id === current.id).checked = !current.checked;
    this.requestUpdate("filters");
  }

  private _filterRepositories = memoizeOne(filterRepositoriesByInput);

  protected render(): TemplateResult | void {
    if (!this.active) return html``;
    this._searchInput = window.localStorage.getItem("hacs-search") || "";

    let repositories = this._filterRepositories(
      this._repositoriesInActiveCategory(this.repositories, this.hacs.configuration?.categories),
      this._searchInput
    );

    if (this.filters.length !== 0) {
      repositories = repositories.filter(
        (repository) => this.filters.find((filter) => filter.id === repository.category)?.checked
      );
    }

    return html`
      <hacs-dialog
        .active=${this.active}
        .hass=${this.hass}
        .title=${localize("dialog_add_repo.title")}
        hideActions
      >
        <div class="searchandfilter">
          <search-input
            no-label-float
            .label=${localize("search.placeholder")}
            .filter=${this._searchInput || ""}
            @value-changed=${this._inputValueChanged}
            ?narrow=${this.narrow}
          ></search-input>
          <div class="filter" ?narrow=${this.narrow}>
            <paper-dropdown-menu
              label="${localize("dialog_add_repo.sort_by")}"
              ?narrow=${this.narrow}
            >
              <paper-listbox slot="dropdown-content" selected="0">
                <paper-item @tap=${() => (this._sortBy = "stars")}
                  >${localize("store.stars")}</paper-item
                >
                <paper-item @tap=${() => (this._sortBy = "name")}
                  >${localize("store.name")}</paper-item
                >
                <paper-item @tap=${() => (this._sortBy = "last_updated")}
                  >${localize("store.last_updated")}</paper-item
                >
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
        </div>
        ${this.filters.length > 1
          ? html`<div class="filters">
              <hacs-filter .filters="${this.filters}"></hacs-filter>
            </div>`
          : ""}
        <div class=${classMap({ content: true, narrow: this.narrow })} @scroll=${this._loadMore}>
          <div class=${classMap({ list: true, narrow: this.narrow })}>
            ${repositories
              .sort((a, b) => {
                if (this._sortBy === "name") {
                  return a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1;
                }
                return a[this._sortBy] > b[this._sortBy] ? -1 : 1;
              })
              .slice(0, this._load)
              .map(
                (repo) => html`<paper-icon-item
                  class=${classMap({ narrow: this.narrow })}
                  @click=${() => this._openInformation(repo)}
                >
                  ${repo.category === "integration"
                    ? html`
                        <img
                          src="https://brands.home-assistant.io/_/${repo.domain}/icon.png"
                          referrerpolicy="no-referrer"
                          @error=${this._onImageError}
                          @load=${this._onImageLoad}
                        />
                      `
                    : html`<ha-svg-icon .path=${mdiGithub} slot="item-icon"></ha-svg-icon>`}
                  <paper-item-body two-line
                    >${repo.name}
                    <div class="category-chip">
                      <hacs-chip
                        .icon=${hacsIcon}
                        .value=${localize(`common.${repo.category}`)}
                      ></hacs-chip>
                    </div>
                    <div secondary>${repo.description}</div>
                  </paper-item-body>
                </paper-icon-item>`
              )}
            ${repositories.length === 0 ? html`<p>${localize("dialog_add_repo.no_match")}</p>` : ""}
          </div>
        </div>
      </hacs-dialog>
    `;
  }

  private _loadMore(ev) {
    const top = ev.target.scrollTop;
    if (top >= this._top) {
      this._load += 1;
    } else {
      this._load -= 1;
    }
    this._top = top;
  }

  private _inputValueChanged(ev: any) {
    this._searchInput = ev.detail.value;
    window.localStorage.setItem("hacs-search", this._searchInput);
  }

  private _openInformation(repo) {
    this.dispatchEvent(
      new CustomEvent("hacs-dialog-secondary", {
        detail: {
          type: "repository-info",
          repository: repo.id,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onImageLoad(ev) {
    ev.target.style.visibility = "initial";
  }

  private _onImageError(ev) {
    if (ev.target) {
      ev.target.outerHTML = `<ha-svg-icon .path=${mdiGithub} slot="item-icon"></ha-svg-icon>`;
    }
  }
  static get styles() {
    return [
      searchStyles,
      scrollBarStyle,
      css`
        .content {
          width: 100%;
          overflow: auto;
          max-height: 870px;
        }

        .filter {
          margin-top: -12px;
          display: flex;
          width: 200px;
          float: right;
        }

        .narrow {
          max-height: 480px;
          min-width: unset !important;
          width: 100% !important;
        }
        .list {
          margin-top: 16px;
          width: 1024px;
          max-width: 100%;
        }
        .category-chip {
          position: absolute;
          top: 8px;
          right: 8px;
        }
        ha-icon {
          --mdc-icon-size: 36px;
        }
        search-input {
          float: left;
          width: 60%;
        }
        search-input[narrow],
        div.filter[narrow],
        paper-dropdown-menu[narrow] {
          width: 100%;
        }
        img {
          align-items: center;
          display: block;
          justify-content: center;
          margin-bottom: 16px;
          max-height: 36px;
          max-width: 36px;
          position: absolute;
        }

        paper-icon-item:focus {
          background-color: var(--divider-color);
        }

        paper-icon-item {
          cursor: pointer;
          padding: 2px 0;
        }

        paper-dropdown-menu {
          margin: 0 12px 4px 0;
        }

        paper-item-body {
          width: 100%;
          min-height: var(--paper-item-body-two-line-min-height, 72px);
          display: var(--layout-vertical_-_display);
          flex-direction: var(--layout-vertical_-_flex-direction);
          justify-content: var(--layout-center-justified_-_justify-content);
        }
        paper-icon-item.narrow {
          border-bottom: 1px solid var(--divider-color);
          padding: 8px 0;
        }
        paper-item-body div {
          font-size: 14px;
          color: var(--secondary-text-color);
        }
        .add {
          border-top: 1px solid var(--divider-color);
          margin-top: 32px;
        }
        .filters {
          width: 100%;
          display: flex;
        }
        .add-actions {
          justify-content: space-between;
        }
        .add,
        .add-actions {
          display: flex;
          align-items: center;
          font-size: 20px;
          height: 65px;
          background-color: var(--sidebar-background-color);
          border-bottom: 1px solid var(--divider-color);
          padding: 0 16px;
          box-sizing: border-box;
        }
        .add-input {
          width: calc(100% - 80px);
          height: 40px;
          border: 0;
          padding: 0 16px;
          font-size: initial;
          color: var(--sidebar-text-color);
          font-family: var(--paper-font-body1_-_font-family);
        }
        input:focus {
          outline-offset: 0;
          outline: 0;
        }
        input {
          background-color: var(--sidebar-background-color);
        }

        hacs-filter {
          width: 100%;
        }
        div[secondary] {
          width: 88%;
        }
      `,
    ];
  }
}
