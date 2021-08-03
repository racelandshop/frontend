import "@material/mwc-list/mwc-list-item";
import { mdiDotsVertical } from "@mdi/js";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import "../../homeassistant-frontend/src/components/ha-button-menu";
import { HomeAssistant, Route } from "../../homeassistant-frontend/src/types";
import { Configuration, LovelaceResource, Repository, Status } from "../data/common";
import { Racelandshop } from "../data/racelandshop";
import { settingsClearAllNewRepositories } from "../data/websocket";
import { activePanel } from "../panels/racelandshop-sections";
import { showDialogAbout } from "./dialogs/racelandshop-about-dialog";
import "./racelandshop-link";

@customElement("racelandshop-tabbed-menu")
export class RacelandshopTabbedMenu extends LitElement {
  @property({ attribute: false }) public configuration!: Configuration;
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public racelandshop!: Racelandshop;
  @property({ attribute: false }) public narrow!: boolean;
  @property({ attribute: false }) public route!: Route;
  @property({ attribute: false }) public repositories!: Repository[];
  @property({ attribute: false }) public lovelace: LovelaceResource[];
  @property({ attribute: false }) public status: Status;

  protected render(): TemplateResult | void {
    return html`
      <ha-button-menu corner="BOTTOM_START" slot="toolbar-icon">
        <mwc-icon-button slot="trigger" alt="menu">
          <ha-svg-icon .path=${mdiDotsVertical}></ha-svg-icon>
        </mwc-icon-button>

        <mwc-list-item action="documentation">
          <racelandshop-link url="https://racelandshop.xyz/">
            ${this.racelandshop.localize("menu.documentation")}
          </racelandshop-link>
        </mwc-list-item>

        ${this.repositories?.filter((repo) => repo.new).length !== 0
          ? html`<mwc-list-item @click=${this._clearAllNewRepositories}>
              ${this.racelandshop.localize("menu.dismiss")}
            </mwc-list-item>`
          : ""}

        <mwc-list-item><racelandshop-link url="https://github.com/racelandshop">GitHub</racelandshop-link></mwc-list-item>
        <mwc-list-item>
          <racelandshop-link url="https://racelandshop.xyz/docs/issues"
            >${this.racelandshop.localize("menu.open_issue")}</racelandshop-link
          >
        </mwc-list-item>

        ${!this.status?.disabled && !this.status?.background_task
          ? html`<mwc-list-item @click=${this._showCustomRepositoriesDialog}>
              ${this.racelandshop.localize("menu.custom_repositories")}
            </mwc-list-item>`
          : ""}

        <mwc-list-item @click=${this._showAboutDialog}>
          ${this.racelandshop.localize("menu.about")}
        </mwc-list-item>
      </ha-button-menu>
    `;
  }

  private async _clearAllNewRepositories() {
    await settingsClearAllNewRepositories(
      this.hass,
      activePanel(this.racelandshop.language, this.route)?.categories || []
    );
  }

  private _showAboutDialog() {
    showDialogAbout(this, this.racelandshop);
  }

  private _showCustomRepositoriesDialog() {
    this.dispatchEvent(
      new CustomEvent("racelandshop-dialog", {
        detail: {
          type: "custom-repositories",
          repositories: this.repositories,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  static get styles() {
    return css``;
  }
}
