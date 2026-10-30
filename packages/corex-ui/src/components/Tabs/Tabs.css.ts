/**
 * Injected once per document. Segment-style pill track for Tabs list
 * and fully-rounded compact trigger.
 */
export const TABS_STYLE_ID = "cx-tabs-styles";

export const TABS_CSS = `
[data-slot="tabs"] {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: var(--p-font-family-sans, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
}

[data-slot="tabs-bar"] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--p-space-200, 8px);
  min-inline-size: 0;
}

[data-slot="tabs"][data-compact="true"] [data-slot="tabs-bar"] {
  flex: 0 0 auto;
}

[data-slot="tabs-track"] {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0;
  block-size: 32px;
  padding: 2px;
  border-radius: 9999px;
  background: var(--p-color-bg-surface-secondary, #f1f1f1);
  max-inline-size: 100%;
  isolation: isolate;
  min-inline-size: 0;
}

[data-slot="tabs"][data-inline-size="fill"] [data-slot="tabs-track"] {
  display: flex;
  flex: 1 1 auto;
  inline-size: 100%;
}

[data-slot="tabs-thumb"] {
  box-sizing: border-box;
  position: absolute;
  z-index: 0;
  inset-block-start: 2px;
  inset-inline-start: 0;
  block-size: 28px;
  border-radius: 9999px;
  background: var(--p-color-bg-surface, #ffffff);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  pointer-events: none;
  transform: translateX(var(--cx-tabs-thumb-x, 0px));
  inline-size: var(--cx-tabs-thumb-width, 0px);
  opacity: var(--cx-tabs-thumb-opacity, 0);
  transition:
    transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1),
    inline-size 200ms cubic-bezier(0.25, 0.1, 0.25, 1),
    opacity 150ms ease;
}

[data-slot="tabs-option"] {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--p-space-200, 8px);
  block-size: 28px;
  min-block-size: 28px;
  margin: 0;
  padding-block: 0;
  padding-inline: 12px;
  border: 0;
  border-radius: 9999px;
  background: transparent;
  color: var(--p-color-text-secondary, #616161);
  font: inherit;
  font-size: var(--p-font-size-325, 0.8125rem);
  font-weight: var(--p-font-weight-medium, 550);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: color 150ms ease;
  min-inline-size: 0;
}

[data-slot="tabs-option-wrap"] {
  display: inline-flex;
  min-inline-size: 0;
}

[data-slot="tabs"][data-inline-size="fill"] [data-slot="tabs-option-wrap"] {
  flex: 1 1 0;
  display: flex;
}

[data-slot="tabs"][data-inline-size="fill"] [data-slot="tabs-option"] {
  flex: 1 1 auto;
  inline-size: 100%;
  justify-content: center;
}

[data-slot="tabs-option"]:focus {
  outline: none;
}

[data-slot="tabs-option"]:focus-visible {
  box-shadow: inset 0 0 0 2px var(--p-color-border-focus, #005bd3);
}

[data-slot="tabs-option"][aria-selected="true"] {
  color: var(--p-color-text, #303030);
}

[data-slot="tabs-option"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

[data-slot="tabs-option-label"] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-inline-size: 0;
}

[data-slot="tabs-compact"] {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  block-size: 32px;
  padding: 2px;
  border-radius: 9999px;
  background: var(--p-color-bg-surface-secondary, #f1f1f1);
  max-inline-size: 100%;
}

[data-slot="tabs-compact"] s-clickable {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  block-size: 28px;
  min-block-size: 28px;
  border-radius: 9999px !important;
  background: var(--p-color-bg-surface, #ffffff) !important;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  max-inline-size: 100%;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="tabs-thumb"],
  [data-slot="tabs-option"] {
    transition: none;
  }
}
`;
