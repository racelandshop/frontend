import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, query } from "lit/decorators";
import memoizeOne from "memoize-one";

import { HomeAssistant } from "../homeassistant-frontend/src/types";

import {
  Route,
  Critical,
  LovelaceResource,
  Status,
  Configuration,
  Repository,
  LocationChangedEvent,
  RacelandshopDialogEvent,
  RemovedRepository,
} from "./data/common";

import {
  getRepositories,
  getConfiguration,
  getStatus,
  getCritical,
  getLovelaceConfiguration,
  getRemovedRepositories,
} from "./data/websocket";

import "./panels/racelandshop-entry-panel";
import "./panels/racelandshop-store-panel";

import "./components/dialogs/racelandshop-event-dialog";
import { navigate } from "../homeassistant-frontend/src/common/navigate";

@customElement("racelandshop-resolver")
export class RacelandshopResolver extends LitElement {
  @property({ attribute: false }) public configuration: Configuration;

  @property({ attribute: false }) public critical!: Critical[];

  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public lovelace: LovelaceResource[];

  @property({ type: Boolean }) public narrow!: boolean;

  @property({ attribute: false }) public repositories: Repository[];

  @property({ attribute: false }) public route!: Route;

  @property({ attribute: false }) public status: Status;

  @property({ attribute: false }) public removed: RemovedRepository[];

  @query("#racelandshop-dialog") private _racelandshopDialog?: any;

  @query("#racelandshop-dialog-secondary") private _racelandshopDialogSecondary?: any;

  private _sortRepositoriesByName = memoizeOne((repositories: Repository[]) =>
    repositories.sort((a: Repository, b: Repository) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    )
  );

  public connectedCallback() {
    super.connectedCallback();
    this.addEventListener("racelandshop-location-changed", (e) =>
      this._setRoute(e as LocationChangedEvent)
    );

    this.addEventListener("racelandshop-dialog", (e) => this._showDialog(e as RacelandshopDialogEvent));
    this.addEventListener("racelandshop-dialog-secondary", (e) =>
      this._showDialogSecondary(e as RacelandshopDialogEvent)
    );
  }

  protected async firstUpdated() {
    window.onpopstate = function () {
      if (window.location.pathname.includes("racelandshop")) {
        window.location.reload();
      }
    };

    /* Backend event subscription */
    this.hass.connection.subscribeEvents(async () => await this._updateProperties(), "racelandshop/config");
    this.hass.connection.subscribeEvents(async () => await this._updateProperties(), "racelandshop/status");

    this.hass.connection.subscribeEvents(
      async () => await this._updateProperties(),
      "racelandshop/repository"
    );
    this.hass.connection.subscribeEvents(
      async () => await this._updateProperties(),
      "lovelace_updated"
    );
    await this._updateProperties();
  }

  private async _updateProperties() {
    const [repositories, configuration, status, critical, lovelace, removed] = await Promise.all([
      getRepositories(this.hass),
      getConfiguration(this.hass),
      getStatus(this.hass),
      getCritical(this.hass),
      getLovelaceConfiguration(this.hass),
      getRemovedRepositories(this.hass),
    ]);

    this.configuration = configuration;
    this.status = status;
    this.removed = removed;
    this.critical = critical;
    this.lovelace = lovelace;
    this.configuration = configuration;
    this.repositories = this._sortRepositoriesByName(repositories);
  }

  protected render(): TemplateResult | void {
    if (this.route.path === "" || this.route.path === "/") {
      this.route.path = "/dashboard";
    }

    return html`${["/integrations", "/frontend", "/automation"].includes(this.route.path)
        ? html`<racelandshop-store-panel
            .hass=${this.hass}
            .route=${this.route}
            .narrow=${this.narrow}
            .configuration=${this.configuration}
            .lovelace=${this.lovelace}
            .repositories=${this.repositories}
            .status=${this.status}
            .removed=${this.removed}
            .section=${this.route.path.split("/")[1]}
          ></racelandshop-store-panel>`
        : html`<racelandshop-entry-panel
            .hass=${this.hass}
            .route=${this.route}
            .narrow=${this.narrow}
            .configuration=${this.configuration}
            .lovelace=${this.lovelace}
            .status=${this.status}
            .removed=${this.removed}
            .repositories=${this.repositories}
          ></racelandshop-entry-panel>`}
      <racelandshop-event-dialog
        .hass=${this.hass}
        .route=${this.route}
        .narrow=${this.narrow}
        .configuration=${this.configuration}
        .lovelace=${this.lovelace}
        .status=${this.status}
        .removed=${this.removed}
        .repositories=${this.repositories}
        id="racelandshop-dialog"
      ></racelandshop-event-dialog>
      <racelandshop-event-dialog
        .hass=${this.hass}
        .route=${this.route}
        .narrow=${this.narrow}
        .configuration=${this.configuration}
        .lovelace=${this.lovelace}
        .status=${this.status}
        .removed=${this.removed}
        .repositories=${this.repositories}
        id="racelandshop-dialog-secondary"
      ></racelandshop-event-dialog>`;
  }

  private _showDialog(ev: RacelandshopDialogEvent): void {
    const dialogParams = ev.detail;
    this._racelandshopDialog.active = true;
    this._racelandshopDialog.params = dialogParams;
    this.addEventListener("racelandshop-dialog-closed", () => (this._racelandshopDialog.active = false));
  }

  private _showDialogSecondary(ev: RacelandshopDialogEvent): void {
    const dialogParams = ev.detail;
    this._racelandshopDialogSecondary.active = true;
    this._racelandshopDialogSecondary.secondary = true;
    this._racelandshopDialogSecondary.params = dialogParams;
    this.addEventListener(
      "racelandshop-secondary-dialog-closed",
      () => (this._racelandshopDialogSecondary.active = false)
    );
  }

  private _setRoute(ev: LocationChangedEvent): void {
    this.route = ev.detail.route;
    navigate(this.route.prefix + this.route.path);
    this.requestUpdate();
  }
}
