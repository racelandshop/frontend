import memoizeOne from "memoize-one";
import { Message, Repository } from "../data/common";
import { Racelandshop } from "../data/racelandshop";
import { addedToLovelace } from "./added-to-lovelace";

export const getMessages = memoizeOne((racelandshop: Racelandshop) => {
  const messages: Message[] = [];
  const repositoriesNotAddedToLovelace: Repository[] = [];
  const repositoriesRestartPending: Repository[] = [];

  racelandshop.repositories.forEach((repo) => {
    if (repo.status === "pending-restart") {
      repositoriesRestartPending.push(repo);
    }
    if (repo.installed && repo.category === "plugin" && !addedToLovelace(racelandshop, repo)) {
      repositoriesNotAddedToLovelace.push(repo);
    }
    if (repo.installed && racelandshop.removed.map((r) => r.repository).includes(repo.full_name)) {
      const removedrepo = racelandshop.removed.find((r) => r.repository === repo.full_name);
      messages.push({
        name: racelandshop
          .localize("entry.messages.removed")
          .replace("{repository}", removedrepo.repository),
        info: removedrepo.reason,
        severity: "error",
        dialog: "removed",
        repository: repo,
      });
    }
  });

  if (racelandshop.status?.startup && ["setup", "waiting", "startup"].includes(racelandshop.status.stage)) {
    messages.push({
      name: racelandshop.localize(`entry.messages.${racelandshop.status.stage}.title`),
      info: racelandshop.localize(`entry.messages.${racelandshop.status.stage}.content`),
      severity: "information",
    });
  }

  if (racelandshop.status?.has_pending_tasks) {
    messages.push({
      name: racelandshop.localize("entry.messages.has_pending_tasks.title"),
      info: racelandshop.localize("entry.messages.has_pending_tasks.content"),
      severity: "warning",
    });
  }

  if (racelandshop.status?.disabled) {
    messages.push({
      name: racelandshop.localize("entry.messages.disabled.title"),
      secondary: racelandshop.localize(`entry.messages.disabled.${racelandshop.status?.disabled_reason}.title`),
      info: racelandshop.localize(`entry.messages.disabled.${racelandshop.status?.disabled_reason}.description`),
      severity: "error",
    });
  }

  if (repositoriesNotAddedToLovelace.length > 0) {
    messages.push({
      name: racelandshop.localize("entry.messages.resources.title"),
      info: racelandshop
        .localize("entry.messages.resources.content")
        .replace("{number}", String(repositoriesNotAddedToLovelace.length)),
      severity: "error",
      path: "/racelandshop/frontend",
    });
  }

  if (repositoriesRestartPending.length > 0) {
    messages.push({
      name: racelandshop.localize("entry.messages.restart.title"),
      info: racelandshop
        .localize("entry.messages.restart.content")
        .replace("{number}", String(repositoriesRestartPending.length))
        .replace(
          "{pluralWording}",
          repositoriesRestartPending.length === 1
            ? racelandshop.localize("common.integration")
            : racelandshop.localize("common.integration_plural")
        ),
      severity: "error",
      path: "/config/server_control",
    });
  }

  return messages;
});
