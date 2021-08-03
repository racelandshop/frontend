import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { RacelandshopDialogBase } from "./racelandshop-dialog-base";

const DIALOG = {
  "add-repository": () => import("./racelandshop-add-repository-dialog"),
  "custom-repositories": () => import("./racelandshop-custom-repositories-dialog"),
  generic: () => import("./racelandshop-generic-dialog"),
  install: () => import("./racelandshop-install-dialog"),
  navigate: () => import("./racelandshop-navigate-dialog"),
  removed: () => import("./racelandshop-removed-dialog"),
  update: () => import("./racelandshop-update-dialog"),
  "repository-info": () => import("./racelandshop-repository-info-dialog"),
  progress: () => import("./racelandshop-progress-dialog"),
};

@customElement("racelandshop-event-dialog")
export class RacelandshopEventDialog extends RacelandshopDialogBase {
  @property({ attribute: false }) public params!: any;

  protected render(): TemplateResult | void {
    if (!this.active) return html``;
    const dialog = this.params.type || "generic";
    DIALOG[dialog]();

    const el: any = document.createElement(`racelandshop-${dialog}-dialog`);
    el.active = true;
    el.hass = this.hass;
    el.racelandshop = this.racelandshop;
    el.narrow = this.narrow;
    el.configuration = this.configuration;
    el.lovelace = this.lovelace;
    el.secondary = this.secondary;
    el.repositories = this.repositories;
    el.route = this.route;
    el.status = this.status;

    if (this.params) {
      for (const [key, value] of Object.entries(this.params)) {
        el[key] = value;
      }
    }
    return html`${el}`;
  }
}
