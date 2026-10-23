/**
 * Injected once per document. Ports the shadcn cmdk Command visuals onto
 * Polaris tokens — search field, grouped list, shortcuts — without Tailwind.
 */
export const COMMAND_STYLE_ID = "cx-command-styles";

export const COMMAND_CSS = `
[data-slot="command"] {
  --command-sidebar-width: 12rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  border-radius: var(--p-border-radius-300, 12px);
  background: var(--p-color-bg-surface, #ffffff);
  color: var(--p-color-text, #303030);
  font-size: var(--p-font-size-325, 0.8125rem);
  border: var(--p-border-width-025, 1px) solid var(--p-color-border, rgba(0, 0, 0, 0.08));
  box-shadow: var(--p-shadow-100, 0 1px 0 rgba(0, 0, 0, 0.05));
}

/* Two-column body: sidebar groups + item panel */
[data-slot="command-body"] {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  align-items: stretch;
}

[data-slot="command-sidebar"] {
  box-sizing: border-box;
  flex: 0 0 var(--command-sidebar-width);
  width: var(--command-sidebar-width);
  display: flex;
  flex-direction: column;
  gap: var(--p-space-100, 4px);
  padding: var(--p-space-300, 12px) var(--p-space-200, 8px);
  border-inline-end: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
  background: var(--p-color-bg-surface-secondary, #f1f1f1);
  overflow-y: auto;
  overscroll-behavior: contain;
}

[data-slot="command-sidebar-item"] {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--p-space-200, 8px);
  width: 100%;
  min-height: 2.25rem;
  margin: 0;
  padding: var(--p-space-200, 8px) var(--p-space-300, 12px);
  border: none;
  border-radius: var(--p-border-radius-200, 8px);
  background: transparent;
  color: var(--p-color-text-secondary, #616161);
  font: inherit;
  font-size: var(--p-font-size-350, 0.875rem);
  font-weight: var(--p-font-weight-regular, 400);
  line-height: var(--p-font-line-height-500, 1.25);
  text-align: start;
  cursor: pointer;
  outline: none;
  transition: background-color 80ms ease, color 80ms ease;
}

[data-slot="command-sidebar-item"]:hover,
[data-slot="command-sidebar-item"][data-hovered] {
  background: var(--p-color-bg-surface, #ffffff);
  color: var(--p-color-text, #303030);
}

[data-slot="command-sidebar-item"][data-selected],
[data-slot="command-sidebar-item"][data-active] {
  background: var(--p-color-bg-surface, #ffffff);
  color: var(--p-color-text, #303030);
  font-weight: var(--p-font-weight-medium, 550);
  box-shadow: var(--p-shadow-100, 0 1px 0 rgba(0, 0, 0, 0.05));
}

[data-slot="command-sidebar-item"]:focus-visible {
  outline: var(--p-border-width-050, 2px) solid var(--p-color-border-focus, #005bd3);
  outline-offset: 1px;
}

[data-slot="command-sidebar-item-icon"] {
  display: inline-flex;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.85;
}

[data-slot="command-sidebar-item-icon"] svg,
[data-slot="command-sidebar-item-icon"] s-icon {
  width: 1.125rem;
  height: 1.125rem;
}

[data-slot="command-sidebar-item-label"] {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-slot="command-panel"] {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

[data-slot="command"][data-sidebar] [data-slot="command-list"] {
  max-height: var(--command-list-max-height, 20rem);
  flex: 1 1 auto;
}

[data-slot="command-dialog-popup"]:has([data-slot="command"][data-sidebar]) {
  width: min(100%, 40rem);
}

[data-slot="command-dialog-popup"] [data-slot="command"] {
  border: none;
  box-shadow: none;
  border-radius: 0;
}

[data-slot="command-input-wrapper"] {
  display: flex;
  align-items: center;
  gap: var(--p-space-200, 8px);
  padding: var(--p-space-200, 8px) var(--p-space-300, 12px);
  border-block-end: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
}

[data-slot="command-input-icon"] {
  flex-shrink: 0;
  opacity: 0.5;
  color: var(--p-color-text-secondary, #616161);
}

[data-slot="command-input"] {
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  margin: 0;
  padding: var(--p-space-100, 4px) 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--p-color-text, #303030);
  font: inherit;
  font-size: var(--p-font-size-350, 0.875rem);
  line-height: var(--p-font-line-height-500, 1.25);
}

[data-slot="command-input"]::placeholder {
  color: var(--p-color-text-secondary, #616161);
}

[data-slot="command-input"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

[data-slot="command-list"] {
  max-height: var(--command-list-max-height, 18rem);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--p-space-100, 4px);
  outline: none;
  scroll-padding-block: var(--p-space-100, 4px);
}

[data-slot="command-empty"] {
  padding: var(--p-space-600, 24px) var(--p-space-400, 16px);
  text-align: center;
  color: var(--p-color-text-secondary, #616161);
  font-size: var(--p-font-size-325, 0.8125rem);
}

[data-slot="command-group"] {
  overflow: hidden;
  padding: var(--p-space-100, 4px);
  color: var(--p-color-text, #303030);
}

[data-slot="command-group"] [cmdk-group-heading] {
  padding: var(--p-space-150, 6px) var(--p-space-200, 8px);
  font-size: var(--p-font-size-275, 0.75rem);
  font-weight: var(--p-font-weight-medium, 500);
  line-height: var(--p-font-line-height-400, 1);
  color: var(--p-color-text-secondary, #616161);
}

[data-slot="command-separator"] {
  height: 1px;
  margin-block: var(--p-space-100, 4px);
  margin-inline: calc(var(--p-space-100, 4px) * -1);
  background: var(--p-color-border, rgba(0, 0, 0, 0.08));
  border: none;
}

[data-slot="command-item"] {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--p-space-200, 8px);
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: var(--p-space-150, 6px) var(--p-space-200, 8px);
  border: none;
  border-radius: var(--p-border-radius-200, 8px);
  background: transparent;
  color: var(--p-color-text, #303030);
  font: inherit;
  font-size: var(--p-font-size-325, 0.8125rem);
  line-height: var(--p-font-line-height-500, 1.25);
  text-align: start;
  cursor: default;
  user-select: none;
  outline: none;
}

[data-slot="command-item"][data-selected="true"] {
  background: var(--p-color-bg-surface-hover, #f1f1f1);
  color: var(--p-color-text, #303030);
}

[data-slot="command-item"][data-disabled="true"] {
  pointer-events: none;
  opacity: 0.5;
}

[data-slot="command-item"] svg,
[data-slot="command-item"] s-icon {
  flex-shrink: 0;
}

[data-slot="command-shortcut"] {
  margin-inline-start: auto;
  font-size: var(--p-font-size-275, 0.75rem);
  letter-spacing: 0.06em;
  color: var(--p-color-text-secondary, #616161);
}

[data-slot="command-item"][data-selected="true"] [data-slot="command-shortcut"] {
  color: var(--p-color-text, #303030);
}

/* Dialog / palette chrome (Base UI Dialog) */
[data-slot="command-dialog-overlay"] {
  position: fixed;
  inset: 0;
  z-index: var(--p-z-index-layer-modal, 520);
  background: color-mix(in srgb, #000 40%, transparent);
}

[data-slot="command-dialog-overlay"][data-starting-style],
[data-slot="command-dialog-overlay"][data-ending-style] {
  opacity: 0;
}

[data-slot="command-dialog-viewport"] {
  position: fixed;
  inset: 0;
  z-index: var(--p-z-index-layer-modal, 520);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--p-space-800, 32px) var(--p-space-400, 16px);
  padding-block-start: min(20vh, 8rem);
  pointer-events: none;
}

[data-slot="command-dialog-popup"] {
  pointer-events: auto;
  box-sizing: border-box;
  width: min(100%, 32rem);
  overflow: hidden;
  border-radius: var(--p-border-radius-300, 12px);
  background: var(--p-color-bg-surface, #ffffff);
  color: var(--p-color-text, #303030);
  border: var(--p-border-width-025, 1px) solid var(--p-color-border, rgba(0, 0, 0, 0.08));
  box-shadow: var(--p-shadow-600, 0 4px 16px rgba(0, 0, 0, 0.12));
  outline: none;
}

[data-slot="command-dialog-popup"][data-starting-style],
[data-slot="command-dialog-popup"][data-ending-style] {
  opacity: 0;
  transform: translateY(-0.5rem) scale(0.98);
}

[data-slot="command-dialog-sr"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;
