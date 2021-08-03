import { Repository } from "../data/common";
import { Racelandshop } from "../data/racelandshop";

const generateUniqueTag = (repository: Repository, version?: string): string =>
  String(
    `${repository.id}${(
      version ||
      repository.installed_version ||
      repository.selected_tag ||
      repository.available_version
    ).replace(/\D+/g, "")}`
  );

export const generateLovelaceURL = (options: {
  repository: Repository;
  version?: string;
  skipTag?: boolean;
}): string =>
  `/racelandshopfiles/${options.repository.full_name.split("/")[1]}/${options.repository.file_name}${
    !options.skipTag ? `?racelandshoptag=${generateUniqueTag(options.repository, options.version)}` : ""
  }`;

export const addedToLovelace = (racelandshop: Racelandshop, repository: Repository): boolean => {
  if (!repository.installed) {
    return true;
  }
  if (repository.category !== "plugin") {
    return true;
  }
  if (racelandshop.status?.lovelace_mode !== "storage") {
    return true;
  }
  const expectedUrl = generateLovelaceURL({ repository, skipTag: true });
  return racelandshop.resources?.some((resource) => resource.url.includes(expectedUrl)) || false;
};
