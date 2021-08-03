import { markdown } from "../../tools/markdown/markdown";
import { version } from "../../version";

import { Racelandshop } from "../../data/racelandshop";
import { showAlertDialog } from "../../../homeassistant-frontend/src/dialogs/generic/show-dialog-box";

export async function showDialogAbout(element: any, racelandshop: Racelandshop) {
  await showAlertDialog(element, {
    title: "Home Assistant Community Store",
    text: markdown.html(`
  **${racelandshop.localize("dialog_about.integration_version")}:** | ${racelandshop.configuration.version}
  --|--
  **${racelandshop.localize("dialog_about.frontend_version")}:** | ${version}
  **${racelandshop.localize("common.repositories")}:** | ${racelandshop.repositories.length}
  **${racelandshop.localize("dialog_about.installed_repositories")}:** | ${
      racelandshop.repositories.filter((repo) => repo.installed).length
    }

  **${racelandshop.localize("dialog_about.useful_links")}:**

  - [General documentation](https://racelandshop.xyz/)
  - [Configuration](https://racelandshop.xyz/docs/configuration/start)
  - [FAQ](https://racelandshop.xyz/docs/faq/what)
  - [GitHub](https://github.com/racelandshop)
  - [Discord](https://discord.gg/apgchf8)
  - [Become a GitHub sponsor? ❤️](https://github.com/sponsors/ludeeus)
  - [BuyMe~~Coffee~~Beer? 🍺🙈](https://buymeacoffee.com/ludeeus)

  ***

  _Everything you find in RACELANDSHOP is **not** tested by Home Assistant, that includes RACELANDSHOP itself.
  The RACELANDSHOP and Home Assistant teams do not support **anything** you find here._`),
  });
}
