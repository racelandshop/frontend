import { LitElement } from "lit";
import { property } from "lit/decorators";
import { Racelandshop } from "./data/racelandshop";
import { sectionsEnabled } from "./panels/racelandshop-sections";
import { addedToLovelace } from "./tools/added-to-lovelace";
import { RacelandshopLogger } from "./tools/racelandshop-logger";
import { localize } from "./localize/localize";
import { ProvideHassLitMixin } from "../homeassistant-frontend/src/mixins/provide-hass-lit-mixin";

export class RacelandshopElement extends ProvideHassLitMixin(LitElement) {
  @property({ attribute: false }) public racelandshop!: Racelandshop;

  public connectedCallback() {
    super.connectedCallback();

    if (this.racelandshop === undefined) {
      this.racelandshop = {
        language: "en",
        messages: [],
        updates: [],
        resources: [],
        repositories: [],
        removed: [],
        sections: [],
        configuration: {} as any,
        status: {} as any,
        addedToLovelace,
        localize: (string: string, replace?: Record<string, any>) =>
          localize(this.racelandshop?.language || "en", string, replace),
        log: new RacelandshopLogger(),
      };
    }

    this.addEventListener("update-racelandshop", (e) =>
      this._updateRacelandshop((e as any).detail as Partial<Racelandshop>)
    );
  }

  protected _updateRacelandshop(obj: Partial<Racelandshop>) {
    let shouldUpdate = false;

    Object.keys(obj).forEach((key) => {
      if (JSON.stringify(this.racelandshop[key]) !== JSON.stringify(obj[key])) {
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      this.racelandshop = { ...this.racelandshop, ...obj };
    }
  }

  protected updated() {
    this.racelandshop.sections = sectionsEnabled(this.racelandshop.language, this.racelandshop.configuration);
  }
}
