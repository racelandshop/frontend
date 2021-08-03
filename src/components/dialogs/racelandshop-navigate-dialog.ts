import "@material/mwc-button/mwc-button";
import "@material/mwc-linear-progress";
import { css, html, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators";
import { navigate } from "../../../homeassistant-frontend/src/common/navigate";
import "./racelandshop-dialog";
import { RacelandshopDialogBase } from "./racelandshop-dialog-base";

@customElement("racelandshop-navigate-dialog")
export class RacelandshopNavigateDialog extends RacelandshopDialogBase {
  @property() public path!: string;

  @state() private _progress = 0;

  protected async firstUpdated() {
    this._updateProgress();
  }

  protected render(): TemplateResult | void {
    if (!this.active) return html``;
    return html`
      <racelandshop-dialog
        @closed=${this.closeDialog}
        .active=${this.active}
        .hass=${this.hass}
        title="Navigating away from RACELANDSHOP"
        >
        <div class="content">
          This takes you away from RACELANDSHOP and to another page, what you see on that page is not a part
          of RACELANDSHOP.
          </br></br>
          Redirect will happen automatically in 10 seconds, if you do not want to wait
          click the "GO NOW" button.
        </div>
        <mwc-linear-progress .progress=${this._progress}></mwc-linear-progress>
        <mwc-button slot="primaryaction" @click=${this._navigate}>
          Go now
        </mwc-button>
      </racelandshop-dialog>
    `;
  }

  public closeDialog() {
    this.active = false;
  }

  private _updateProgress() {
    setTimeout(() => {
      if (!this.active) {
        return;
      }
      this._progress += 0.1;
      if (this._progress === 1) {
        this._navigate();
      } else {
        this._updateProgress();
      }
    }, 1000);
  }

  private _navigate() {
    if (this.active) {
      navigate(this.path);
    }
  }

  static get styles() {
    return [
      css`
        racelandshop-dialog {
          --racelandshop-dialog-max-width: 460px;
        }
        mwc-linear-progress {
          --mdc-theme-primary: var(--primary-color);
        }
      `,
    ];
  }
}
