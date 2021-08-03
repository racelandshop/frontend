import { HomeAssistant } from "../../homeassistant-frontend/src/types";
import {
  Configuration,
  Repository,
  Critical,
  Status,
  LovelaceResource,
  LovelaceResourcesMutableParams,
  RemovedRepository,
} from "./common";

export const getConfiguration = async (hass: HomeAssistant) => {
  const response = await hass.connection.sendMessagePromise<Configuration>({
    type: "racelandshop/config",
  });
  return response;
};

export const getRepositories = async (hass: HomeAssistant) => {
  const response = await hass.connection.sendMessagePromise<Repository[]>({
    type: "racelandshop/repositories",
  });
  return response;
};

export const getCritical = async (hass: HomeAssistant) => {
  const response = await hass.connection.sendMessagePromise<Critical[]>({
    type: "racelandshop/get_critical",
  });
  return response;
};

export const getStatus = async (hass: HomeAssistant) => {
  const response = await hass.connection.sendMessagePromise<Status>({
    type: "racelandshop/status",
  });
  return response;
};

export const getRemovedRepositories = async (hass: HomeAssistant) => {
  const response = await hass.connection.sendMessagePromise<RemovedRepository[]>({
    type: "racelandshop/removed",
  });
  return response;
};

export const repositoryInstall = async (hass: HomeAssistant, repository: string) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository",
    action: "install",
    repository: repository,
  });
};

export const repositoryUninstall = async (hass: HomeAssistant, repository: string) => {
  return await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository",
    action: "uninstall",
    repository: repository,
  });
};

export const repositoryReleasenotes = async (hass: HomeAssistant, repository: string) => {
  const response = await hass.connection.sendMessagePromise<
    { name: string; body: string; tag: string }[]
  >({
    type: "racelandshop/repository",
    action: "release_notes",
    repository: repository,
  });
  return response;
};

export const repositoryToggleBeta = async (hass: HomeAssistant, repository: string) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository",
    action: "toggle_beta",
    repository: repository,
  });
};

export const repositoryInstallVersion = async (
  hass: HomeAssistant,
  repository: string,
  version: string
) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository/data",
    action: "install",
    repository: repository,
    data: version,
  });
};

export const repositorySetVersion = async (
  hass: HomeAssistant,
  repository: string,
  version: string
) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository/data",
    action: "set_version",
    repository: repository,
    data: version,
  });
};

export const repositoryAdd = async (hass: HomeAssistant, repository: string, category: string) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository/data",
    action: "add",
    repository: repository,
    data: category,
  });
};

export const repositorySetNotNew = async (hass: HomeAssistant, repository: string) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository",
    action: "not_new",
    repository: repository,
  });
};

export const repositoryUpdate = async (hass: HomeAssistant, repository: string) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository",
    action: "update",
    repository: repository,
  });
};

export const repositoryDelete = async (hass: HomeAssistant, repository: string) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/repository",
    action: "delete",
    repository: repository,
  });
};

export const settingsClearAllNewRepositories = async (
  hass: HomeAssistant,
  categories: string[]
) => {
  await hass.connection.sendMessagePromise<void>({
    type: "racelandshop/settings",
    action: "clear_new",
    categories,
  });
};

export const getLovelaceConfiguration = async (hass: HomeAssistant) => {
  try {
    const response = await hass.connection.sendMessagePromise<LovelaceResource[]>({
      type: "lovelace/resources",
    });
    return response;
  } catch (e) {
    return null;
  }
};

export const fetchResources = (hass: HomeAssistant): Promise<LovelaceResource[]> =>
  hass.connection.sendMessagePromise({
    type: "lovelace/resources",
  });

export const createResource = (hass: HomeAssistant, values: LovelaceResourcesMutableParams) =>
  hass.callWS<LovelaceResource>({
    type: "lovelace/resources/create",
    ...values,
  });

export const updateResource = (hass: HomeAssistant, values: LovelaceResourcesMutableParams) =>
  hass.callWS<LovelaceResource>({
    type: "lovelace/resources/update",
    ...values,
  });

export const deleteResource = (hass: HomeAssistant, id: string) =>
  hass.callWS({
    type: "lovelace/resources/delete",
    resource_id: id,
  });
