import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators";
import { HomeAssistant, Route } from "../../../homeassistant-frontend/src/types";
import {
  Configuration,
  Critical,
  LovelaceResource,
  RemovedRepository,
  Repository,
  Status,
} from "../../data/common";
import { Racelandshop } from "../../data/racelandshop";

export class RacelandshopDialogBase extends LitElement {
  @property({ attribute: false }) public configuration: Configuration;
  @property({ attribute: false }) public racelandshop: Racelandshop;
  @property({ attribute: false }) public critical!: Critical[];
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public lovelace: LovelaceResource[];
  @property({ attribute: false }) public repositories: Repository[];
  @property({ attribute: false }) public route!: Route;
  @property({ attribute: false }) public status: Status;
  @property({ attribute: false }) public removed: RemovedRepository[];
  @property({ type: Boolean }) public active: boolean = false;
  @property({ type: Boolean }) public secondary: boolean = false;
  @property({ type: Boolean }) public loading: boolean = true;
  @property({ type: Boolean }) public narrow!: boolean;
  @property({ type: Boolean }) public sidebarDocked!: boolean;

  shouldUpdate(changedProperties: PropertyValues) {
    changedProperties.forEach((_oldValue, propName) => {
      if (propName === "hass") {
        this.sidebarDocked = window.localStorage.getItem("dockedSidebar") === '"docked"';
      }
    });
    return (
      changedProperties.has("sidebarDocked") ||
      changedProperties.has("narrow") ||
      changedProperties.has("active") ||
      changedProperties.has("params") ||
      changedProperties.has("_error") ||
      changedProperties.has("_progress") ||
      changedProperties.has("_releaseNotes") ||
      changedProperties.has("_updating")
    );
  }
  public connectedCallback() {
    super.connectedCallback();
    this.sidebarDocked = window.localStorage.getItem("dockedSidebar") === '"docked"';
  }
}
