import { css, CSSResultGroup } from "lit";
import { racelandshopIconStyle, racelandshopButtonStyle, racelandshopLinkStyle } from "./element-styles";
import { haStyle } from "../../homeassistant-frontend/src/resources/styles";

export const racelandshopCommonClasses = css`
  .warning {
    color: var(--hcv-color-warning);
  }
  .pending_update {
    color: var(--hcv-color-update);
  }
  .pending_restart,
  .error,
  .uninstall {
    color: var(--hcv-color-error);
    --mdc-theme-primary: var(--hcv-color-error);
  }
  .header {
    font-size: var(--paper-font-headline_-_font-size);
    opacity: var(--dark-primary-opacity);
    padding: 8px 0 4px 16px;
  }
`;

export const RacelandshopStyles: CSSResultGroup = [
  haStyle,
  racelandshopIconStyle,
  racelandshopButtonStyle,
  racelandshopCommonClasses,
  racelandshopLinkStyle,
];
