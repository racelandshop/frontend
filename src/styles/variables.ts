import { css } from "lit";

export const racelandshopStyleVariables = css`
  :host {
    --hcv-color-error: var(--racelandshop-error-color, var(--google-red-500, #f44336));
    --hcv-color-warning: var(--racelandshop-warning-color, #ff8c00);
    --hcv-color-update: var(--racelandshop-update-color, #f4b400);
    --hcv-color-new: var(--racelandshop-new-color, var(--google-blue-500, #2196f3));
    --hcv-color-icon: var(--racelandshop--default-icon-color, var(--sidebar-icon-color));
    --hcv-color-markdown-background: var(--markdown-code-background-color, #f6f8fa);

    --hcv-text-color-primary: var(--primary-text-color);
    --hcv-text-color-on-background: var(--text-primary-color);
    --hcv-text-color-secondary: var(--secondary-text-color);
    --hcv-text-color-link: var(--link-text-color, var(--accent-color));

    --mdc-dialog-heading-ink-color: var(--hcv-text-color-primary);
    --mdc-dialog-content-ink-color: var(--hcv-text-color-primary);

    /*racelandshop-fab*/
    --hcv-color-fab: var(--racelandshop-fab-color, var(--accent-color));
    --hcv-text-color-fab: var(--racelandshop-fab-text-color, var(--hcv-text-color-on-background));

    /*racelandshop-chip*/
    --hcv-color-chip: var(--racelandshop-chip-color, var(--accent-color));
    --hcv-text-color-chip: var(--racelandshop-chip-text-color, var(--hcv-text-color-on-background));

    /*racelandshop-link*/
    --hcv-text-decoration-link: var(--racelandshop-link-text-decoration, none);
  }
`;
