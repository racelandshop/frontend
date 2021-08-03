import { css, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { Repository } from "../../data/common";
import { deleteResource, fetchResources, repositoryUninstall } from "../../data/websocket";
import "./racelandshop-dialog";
import { RacelandshopDialogBase } from "./racelandshop-dialog-base";

@customElement("racelandshop-removed-dialog")
export class RacelandshopRemovedDialog extends RacelandshopDialogBase {
  @property({ attribute: false }) public repository: Repository;
  @property({ type: Boolean }) private _updating: boolean = false;

  protected render(): TemplateResult | void {
    if (!this.active) return html``;
    const removedrepo = this.racelandshop.removed.find((r) => r.repository === this.repository.full_name);
    return html`
      <racelandshop-dialog
        .active=${this.active}
        .hass=${this.hass}
        .title=${this.racelandshop.localize("entry.messages.removed", { repository: "" })}
      >
        <div class="content">
          <div><b>${this.racelandshop.localize("dialog_removed.name")}:</b> ${this.repository.name}</div>
          ${removedrepo.removal_type
            ? html` <div>
                <b>${this.racelandshop.localize("dialog_removed.type")}:</b> ${removedrepo.removal_type}
              </div>`
            : ""}
          ${removedrepo.reason
            ? html` <div>
                <b>${this.racelandshop.localize("dialog_removed.reason")}:</b> ${removedrepo.reason}
              </div>`
            : ""}
          ${removedrepo.link
            ? html`          <div>
            </b><racelandshop-link .url=${removedrepo.link}>${this.racelandshop.localize(
                "dialog_removed.link"
              )}</racelandshop-link>
          </div>`
            : ""}
        </div>
        <mwc-button class="uninstall" slot="primaryaction" @click=${this._uninstallRepository}
          >${this._updating
            ? html`<ha-circular-progress active size="small"></ha-circular-progress>`
            : this.racelandshop.localize("common.uninstall")}</mwc-button
        >
        <!--<mwc-button slot="secondaryaction" @click=${this._ignoreMessage}
          >${this.racelandshop.localize("common.ignore")}</mwc-button
        >-->
      </racelandshop-dialog>
    `;
  }

  static get styles() {
    return css`
      .uninstall {
        --mdc-theme-primary: var(--hcv-color-error);
      }
    `;
  }

  private _lovelaceUrl(): string {
    return `/racelandshopfiles/${this.repository?.full_name.split("/")[1]}/${this.repository?.file_name}`;
  }

  private async _uninstallRepository(): Promise<void> {
    this._updating = true;
    if (
      this.repository.category === "plugin" &&
      this.racelandshop.status &&
      this.racelandshop.status.lovelace_mode !== "yaml"
    ) {
      const resources = await fetchResources(this.hass);
      resources
        .filter((resource) => resource.url === this._lovelaceUrl())
        .forEach((resource) => {
          deleteResource(this.hass, String(resource.id));
        });
    }
    await repositoryUninstall(this.hass, this.repository.id);
    this._updating = false;
    this.active = false;
  }
  private async _ignoreMessage(): Promise<void> {
    this._updating = false;
    this.active = false;
  }
}
