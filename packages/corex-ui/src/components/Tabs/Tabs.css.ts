/**
 * Injected once per document. Segment pill track and card/folder tabs
 * with connected content panel. Compact mode uses the plain Popover trigger.
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

/* ── Segment (default) ─────────────────────────────────────────────── */

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
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
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

/* ── Card / folder (Shopify analytics Freeform/Cohorts style) ────────
 * Continuous gray rail + white active tab with large top radius and
 * concave bottom fillets (the scooped shoulders from the reference).
 */

[data-slot="tabs"][data-variant="card"] {
  --cx-tabs-card-radius: 12px;
  --cx-tabs-card-tab-radius: 14px;
  --cx-tabs-card-fillet: 14px;
  --cx-tabs-card-border: #d4d4d4;
  --cx-tabs-card-rail: #e8e8e8;
  --cx-tabs-card-active: #ffffff;
  inline-size: 100%;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-shell"] {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  position: relative;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-bar"] {
  position: relative;
  z-index: 2;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 0;
  padding: 0;
  background: var(--cx-tabs-card-rail);
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-track"] {
  display: flex;
  flex: 1 1 auto;
  align-items: flex-end;
  gap: 0;
  block-size: auto;
  padding: 0;
  border-radius: 0;
  background: transparent;
  isolation: auto;
  overflow: visible;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-thumb"] {
  display: none;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option-wrap"] {
  display: flex;
  flex: 1 1 0;
  min-inline-size: 0;
  position: relative;
  overflow: visible;
  z-index: 0;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option-wrap"]:has([aria-selected="true"]) {
  z-index: 3;
}

[data-slot="tabs"][data-variant="card"][data-inline-size="auto"] [data-slot="tabs-option-wrap"] {
  flex: 1 1 0;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"] {
  position: relative;
  flex: 1 1 auto;
  inline-size: 100%;
  justify-content: center;
  gap: 8px;
  block-size: 36px;
  min-block-size: 36px;
  margin: 0;
  padding-inline: 16px;
  border: 0;
  border-radius: var(--cx-tabs-card-tab-radius) var(--cx-tabs-card-tab-radius) 0 0;
  background: transparent;
  color: #6d7175;
  font-size: 13px;
  font-weight: 550;
  letter-spacing: 0;
  z-index: 0;
  overflow: visible;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"]:not([aria-selected="true"]):not(:disabled):hover {
  color: #303030;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"][aria-selected="true"] {
  z-index: 3;
  background: var(--cx-tabs-card-active);
  color: #303030;
}

/*
 * Concave fillets — scooped shoulders where the white active tab meets
 * the gray rail (the distinctive folder-tab curve from the reference).
 */
[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"][aria-selected="true"]::before,
[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"][aria-selected="true"]::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: var(--cx-tabs-card-fillet);
  height: var(--cx-tabs-card-fillet);
  pointer-events: none;
  z-index: 1;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"][aria-selected="true"]::before {
  left: calc(var(--cx-tabs-card-fillet) * -1);
  background: radial-gradient(
    circle at 0 0,
    transparent calc(var(--cx-tabs-card-fillet) - 0.5px),
    var(--cx-tabs-card-active) var(--cx-tabs-card-fillet)
  );
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"][aria-selected="true"]::after {
  right: calc(var(--cx-tabs-card-fillet) * -1);
  background: radial-gradient(
    circle at 100% 0,
    transparent calc(var(--cx-tabs-card-fillet) - 0.5px),
    var(--cx-tabs-card-active) var(--cx-tabs-card-fillet)
  );
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"]:focus-visible {
  outline: 2px solid var(--p-color-border-focus, #005bd3);
  outline-offset: -2px;
  box-shadow: none;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"] s-icon {
  color: currentColor;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-option"]:not([aria-selected="true"]) s-icon {
  opacity: 0.7;
}

[data-slot="tabs-panels"] {
  display: none;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-panels"] {
  display: block;
  position: relative;
  z-index: 1;
  background: var(--cx-tabs-card-active);
  min-inline-size: 0;
}

[data-slot="tabs-content"] {
  display: none;
  box-sizing: border-box;
  padding: 12px;
}

[data-slot="tabs-content"][data-active="true"] {
  display: block;
}

[data-slot="tabs"][data-variant="card"] [data-slot="tabs-bar-extra"] {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline: 8px;
  padding-block-end: 6px;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="tabs-thumb"],
  [data-slot="tabs-option"] {
    transition: none;
  }
}
`;
