import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import memoizeOne from "memoize-one";
import { Repository } from "../../data/common";
import { markdown } from "../../tools/markdown/markdown";
import "./racelandshop-dialog";
import "../racelandshop-link";
import { RacelandshopDialogBase } from "./racelandshop-dialog-base";

@customElement("racelandshop-generic-dialog")
export class RacelandshopGenericDialog extends RacelandshopDialogBase {
  @property({ type: Boolean }) public markdown: boolean = false;
  @property() public repository?: string;
  @property() public header?: string;
  @property() public content?: string;

  private _getRepository = memoizeOne((repositories: Repository[], repository: string) =>
    repositories?.find((repo) => repo.id === repository)
  );

  protected render(): TemplateResult | void {
    if (!this.active) return html``;
    const repository = this._getRepository(this.repositories, this.repository);
    return html`
      <racelandshop-dialog .active=${this.active} .narrow=${this.narrow} .hass=${this.hass}>
        <div slot="header">${this.header || ""}</div>
        ${this.markdown
          ? this.repository
            ? markdown.html(this.content || "", repository)
            : markdown.html(this.content || "")
          : this.content || ""}
      </racelandshop-dialog>
    `;
  }
}
