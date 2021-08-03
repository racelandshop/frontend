import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-item/paper-item-body";
import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import "../../homeassistant-frontend/src/components/ha-card";
import "../../homeassistant-frontend/src/components/ha-icon-next";
import "../../homeassistant-frontend/src/components/ha-svg-icon";
import { HomeAssistant } from "../../homeassistant-frontend/src/types";
import { RacelandshopPageNavigation } from "../data/common";
import "./racelandshop-link";

@customElement("racelandshop-section-navigation")
class RacelandshopSectionNavigation extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public pages!: RacelandshopPageNavigation[];
  @property() public header: string;
  @property({ type: Boolean, attribute: "no-next" }) public noNext: boolean = false;

  protected render(): TemplateResult {
    return html`
      <ha-card>
        ${this.header ? html`<div class="card-header">${this.header}</div>` : ""}
        ${this.pages.map(
          (page) =>
            html`
              <racelandshop-link .url=${page.path}>
                <paper-icon-item
                  @tap=${() => {
                    page.name === "Unexpected frontend version"
                      ? this._clearCache()
                      : this._openDialog(page);
                  }}
                >
                  <ha-svg-icon
                    .path=${page.iconPath}
                    slot="item-icon"
                    class="${page.class || ""}"
                  ></ha-svg-icon>
                  <paper-item-body two-line>
                    ${page.name} ${page.secondary ? ` (${page.secondary})` : ""}
                    <div secondary>${page.info ? page.info : ""}</div>
                  </paper-item-body>
                  ${!this.noNext ? html`<ha-icon-next></ha-icon-next>` : ""}
                </paper-icon-item>
              </racelandshop-link>
            `
        )}
      </ha-card>
    `;
  }

  private _openDialog(page: RacelandshopPageNavigation) {
    if (!page.dialog) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("racelandshop-dialog", {
        detail: {
          type: page.dialog,
          repository: page.repository,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _clearCache() {
    window.parent.location.href = window.location.href;
  }

  static get styles(): CSSResultGroup {
    return css`
      racelandshop-link {
        text-decoration: none;
        --hcv-text-color-link: var(--primary-text-color);
        position: relative;
        display: block;
        outline: 0;
      }
      ha-svg-icon,
      ha-icon-next {
        color: var(--secondary-text-color);
      }
      .iron-selected paper-item::before,
      a:not(.iron-selected):focus::before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        content: "";
        transition: opacity 15ms linear;
        will-change: opacity;
      }
      a:not(.iron-selected):focus::before {
        background-color: currentColor;
        opacity: var(--dark-divider-opacity);
      }
      .iron-selected paper-item:focus::before,
      .iron-selected:focus paper-item::before {
        opacity: 0.2;
      }
      div[secondary] {
        white-space: normal;
      }
      ha-svg-icon.warning {
        color: var(--hcv-color-warning);
      }
      ha-svg-icon.error {
        color: var(--hcv-color-error);
      }

      .card-header {
        color: var(--ha-card-header-color, --primary-text-color);
        font-family: var(--ha-card-header-font-family, inherit);
        font-size: var(--ha-card-header-font-size, 24px);
        letter-spacing: -0.012em;
        line-height: 32px;
        display: block;
        padding: 8px 16px 0;
      }
    `;
  }
}
