import { css, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { createCloseHeading } from "../../../homeassistant-frontend/src/components/ha-dialog";
import { RacelandshopStyles } from "../../styles/racelandshop-common-style";
import { racelandshopStyleDialog, scrollBarStyle } from "../../styles/element-styles";
import { RacelandshopDialogBase } from "./racelandshop-dialog-base";

@customElement("racelandshop-dialog")
export class RacelandshopDialog extends RacelandshopDialogBase {
  @property({ type: Boolean }) public hideActions: boolean = false;
  @property({ type: Boolean }) public scrimClickAction: boolean = false;
  @property({ type: Boolean }) public escapeKeyAction: boolean = false;
  @property({ type: Boolean }) public noClose: boolean = false;
  @property() public title!: string;

  protected render(): TemplateResult | void {
    if (!this.active) {
      return html``;
    }

    return html` <ha-dialog
      ?open=${this.active}
      ?scrimClickAction=${this.scrimClickAction}
      ?escapeKeyAction=${this.escapeKeyAction}
      @closed=${this.closeDialog}
      ?hideActions=${this.hideActions}
      .heading=${!this.noClose ? createCloseHeading(this.hass, this.title) : this.title}
    >
      <div class="content scroll" ?narrow=${this.narrow}>
        <slot></slot>
      </div>
      <slot class="primary" name="primaryaction" slot="primaryAction"></slot>
      <slot class="secondary" name="secondaryaction" slot="secondaryAction"></slot>
    </ha-dialog>`;
  }

  public closeDialog() {
    this.active = false;
    this.dispatchEvent(
      new CustomEvent("closed", {
        bubbles: true,
        composed: true,
      })
    );
  }

  static get styles() {
    return [
      racelandshopStyleDialog,
      scrollBarStyle,
      RacelandshopStyles,
      css`
        .content {
          overflow: auto;
        }
        ha-dialog {
          --mdc-dialog-max-width: var(--racelandshop-dialog-max-width, calc(100vw - 16px));
          --mdc-dialog-min-width: var(--racelandshop-dialog-min-width, 280px);
        }
        .primary {
          margin-left: 52px;
        }

        @media only screen and (min-width: 1280px) {
          ha-dialog {
            --mdc-dialog-max-width: var(--racelandshop-dialog-max-width, 990px);
          }
        }
      `,
    ];
  }
}
