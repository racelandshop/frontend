import "../../../homeassistant-frontend/src/components/ha-circular-progress";
import { html, TemplateResult, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators";
import "./racelandshop-dialog";
import { RacelandshopDialogBase } from "./racelandshop-dialog-base";

@customElement("racelandshop-progress-dialog")
export class RacelandshopProgressDialog extends RacelandshopDialogBase {
  @property() public title?: string;

  @property() public content?: string;

  @property() public confirmText?: string;

  @property() public confirm: () => Promise<void>;

  @property({ type: Boolean }) private _inProgress: boolean = false;

  shouldUpdate(changedProperties: PropertyValues) {
    return (
      changedProperties.has("active") ||
      changedProperties.has("title") ||
      changedProperties.has("content") ||
      changedProperties.has("confirmText") ||
      changedProperties.has("confirm") ||
      changedProperties.has("_inProgress")
    );
  }

  protected render(): TemplateResult | void {
    if (!this.active) return html``;
    return html`
      <racelandshop-dialog .active=${this.active} .hass=${this.hass} title=${this.title || ""}>
        <div class="content">
          ${this.content || ""}
        </div>
        <mwc-button slot="secondaryaction" ?disabled=${this._inProgress} @click=${this._close}>
          ${this.racelandshop.localize("common.cancel")}
        </mwc-button>
        <mwc-button slot="primaryaction" @click=${this._confirmed}>
          ${
            this._inProgress
              ? html`<ha-circular-progress active size="small"></ha-circular-progress>`
              : this.confirmText || this.racelandshop.localize("confirm.yes")
          }</mwc-button
          >
        </mwc-button>
      </racelandshop-dialog>
    `;
  }

  private async _confirmed() {
    this._inProgress = true;
    await this.confirm();
    this._inProgress = false;
    this._close();
  }

  private _close() {
    this.active = false;
    this.dispatchEvent(
      new Event("racelandshop-dialog-closed", {
        bubbles: true,
        composed: true,
      })
    );
  }
}
