import { html, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators";
import { applyThemesOnElement } from "../homeassistant-frontend/src/common/dom/apply_themes_on_element";
import { navigate } from "../homeassistant-frontend/src/common/navigate";
import { makeDialogManager } from "../homeassistant-frontend/src/dialogs/make-dialog-manager";
import "../homeassistant-frontend/src/resources/ha-style";
import { HomeAssistant, Route } from "../homeassistant-frontend/src/types";
import "./components/dialogs/racelandshop-event-dialog";
import {
  Configuration,
  Critical,
  RacelandshopDialogEvent,
  LocationChangedEvent,
  LovelaceResource,
  RemovedRepository,
  Repository,
  Status,
} from "./data/common";
import {
  getConfiguration,
  getCritical,
  getLovelaceConfiguration,
  getRemovedRepositories,
  getRepositories,
  getStatus,
} from "./data/websocket";
import { RacelandshopElement } from "./racelandshop";
import "./racelandshop-router";
import { RacelandshopStyles } from "./styles/racelandshop-common-style";
import { racelandshopStyleVariables } from "./styles/variables";

@customElement("racelandshop-frontend")
class RacelandshopFrontend extends RacelandshopElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public configuration: Configuration;

  @property({ attribute: false }) public critical!: Critical[];

  @property({ attribute: false }) public lovelace: LovelaceResource[];

  @property({ attribute: false }) public narrow!: boolean;

  @property({ attribute: false }) public removed: RemovedRepository[];

  @property({ attribute: false }) public repositories: Repository[];

  @property({ attribute: false }) public route!: Route;

  @property({ attribute: false }) public status: Status;

  @query("#racelandshop-dialog") private _racelandshopDialog?: any;

  @query("#racelandshop-dialog-secondary") private _racelandshopDialogSecondary?: any;

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.racelandshop.language = this.hass.language;
    this.addEventListener("racelandshop-location-changed", (e) =>
      this._setRoute(e as LocationChangedEvent)
    );

    this.addEventListener("racelandshop-dialog", (e) => this._showDialog(e as RacelandshopDialogEvent));
    this.addEventListener("racelandshop-dialog-secondary", (e) =>
      this._showDialogSecondary(e as RacelandshopDialogEvent)
    );

    this.hass.connection.subscribeEvents(
      async () => await this._updateProperties("configuration"),
      "racelandshop/config"
    );
    this.hass.connection.subscribeEvents(
      async () => await this._updateProperties("status"),
      "racelandshop/status"
    );
    this.hass.connection.subscribeEvents(
      async () => await this._updateProperties("status"),
      "racelandshop/stage"
    );
    this.hass.connection.subscribeEvents(
      async () => await this._updateProperties("repositories"),
      "racelandshop/repository"
    );
    this.hass.connection.subscribeEvents(
      async () => await this._updateProperties("lovelace"),
      "lovelace_updated"
    );

    makeDialogManager(this, this.shadowRoot!);
    this._updateProperties();
    if (this.route.path === "") {
      navigate("/racelandshop/entry", { replace: true });
    }

    this._applyTheme();
  }

  private async _updateProperties(prop = "all") {
    const _updates: any = {};
    const _fetch: any = {};

    if (prop === "all") {
      [
        _fetch.repositories,
        _fetch.configuration,
        _fetch.status,
        _fetch.critical,
        _fetch.resources,
        _fetch.removed,
      ] = await Promise.all([
        getRepositories(this.hass),
        getConfiguration(this.hass),
        getStatus(this.hass),
        getCritical(this.hass),
        getLovelaceConfiguration(this.hass),
        getRemovedRepositories(this.hass),
      ]);

      this.lovelace = _fetch.resources;
      this.repositories = _fetch.repositories;
    } else if (prop === "configuration") {
      _fetch.configuration = await getConfiguration(this.hass);
    } else if (prop === "status") {
      _fetch.status = await getStatus(this.hass);
    } else if (prop === "repositories") {
      _fetch.repositories = await getRepositories(this.hass);
      this.repositories = _fetch.repositories;
    } else if (prop === "lovelace") {
      _fetch.resources = await getLovelaceConfiguration(this.hass);
    }

    Object.keys(_fetch).forEach((update) => {
      if (_fetch[update] !== undefined) {
        _updates[update] = _fetch[update];
      }
    });
    if (_updates) {
      this._updateRacelandshop(_updates);
    }
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this.racelandshop) {
      return html``;
    }

    return html`
      <racelandshop-router
        .hass=${this.hass}
        .racelandshop=${this.racelandshop}
        .route=${this.route}
        .narrow=${this.narrow}
        .configuration=${this.configuration}
        .lovelace=${this.lovelace}
        .status=${this.status}
        .critical=${this.critical}
        .removed=${this.removed}
        .repositories=${this.repositories}
      ></racelandshop-router>
      <racelandshop-event-dialog
        .hass=${this.hass}
        .racelandshop=${this.racelandshop}
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
        .racelandshop=${this.racelandshop}
        .route=${this.route}
        .narrow=${this.narrow}
        .configuration=${this.configuration}
        .lovelace=${this.lovelace}
        .status=${this.status}
        .removed=${this.removed}
        .repositories=${this.repositories}
        id="racelandshop-dialog-secondary"
      ></racelandshop-event-dialog>
    `;
  }

  static get styles() {
    return [RacelandshopStyles, racelandshopStyleVariables];
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
    navigate(this.route.path, { replace: true });
    this.requestUpdate();
  }

  private _applyTheme() {
    let options: Partial<HomeAssistant["selectedTheme"]> | undefined;

    const themeName =
      this.hass.selectedTheme?.theme ||
      (this.hass.themes.darkMode && this.hass.themes.default_dark_theme
        ? this.hass.themes.default_dark_theme!
        : this.hass.themes.default_theme);

    options = this.hass.selectedTheme;
    if (themeName === "default" && options?.dark === undefined) {
      options = {
        ...this.hass.selectedTheme,
      };
    }

    applyThemesOnElement(this.parentElement, this.hass.themes, themeName, {
      ...options,
      dark: this.hass.themes.darkMode,
    });
    this.parentElement.style.backgroundColor = "var(--primary-background-color)";
  }
}
