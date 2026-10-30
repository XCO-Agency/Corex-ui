/**
 * Injected once per document. Pill track + sliding thumb for Segment.
 * Uses Polaris design tokens with hex fallbacks for host environments
 * that do not load the Polaris stylesheet.
 */
export const SEGMENT_STYLE_ID = "cx-segment-styles";

export const SEGMENT_CSS = `
[data-slot="segment"] {
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--p-space-200, 8px);
  max-inline-size: 100%;
  font-family: var(--p-font-family-sans, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
}

[data-slot="segment"][data-inline-size="fill"] {
  display: flex;
  inline-size: 100%;
}

[data-slot="segment-label"] {
  display: block;
  margin: 0;
  color: var(--p-color-text, #303030);
  font-size: var(--p-font-size-325, 0.8125rem);
  font-weight: var(--p-font-weight-medium, 550);
  line-height: var(--p-font-line-height-500, 1.25);
}

[data-slot="segment-track"] {
  box-sizing: border-box;
  position: relative;
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-items: center;
  gap: 0;
  block-size: var(--cx-segment-track-height, 32px);
  padding: var(--cx-segment-pad, 2px);
  border-radius: 9999px;
  background: var(--p-color-bg-surface-secondary, #f1f1f1);
  max-inline-size: 100%;
  isolation: isolate;
}

[data-slot="segment"][data-inline-size="fill"] [data-slot="segment-track"] {
  display: grid;
  inline-size: 100%;
}

[data-slot="segment"][data-size="small"] {
  --cx-segment-pad: 2px;
  --cx-segment-track-height: 28px;
  --cx-segment-action-height: 24px;
  --cx-segment-font-size: var(--p-font-size-275, 0.75rem);
  --cx-segment-padding-inline: 10px;
}

[data-slot="segment"][data-size="base"] {
  --cx-segment-pad: 2px;
  --cx-segment-track-height: 32px;
  --cx-segment-action-height: 28px;
  --cx-segment-font-size: var(--p-font-size-325, 0.8125rem);
  --cx-segment-padding-inline: 14px;
}

[data-slot="segment"][data-size="large"] {
  --cx-segment-pad: 2px;
  --cx-segment-track-height: 40px;
  --cx-segment-action-height: 36px;
  --cx-segment-font-size: var(--p-font-size-350, 0.875rem);
  --cx-segment-padding-inline: 18px;
}

[data-slot="segment-thumb"] {
  box-sizing: border-box;
  position: absolute;
  z-index: 0;
  inset-block-start: var(--cx-segment-pad, 2px);
  inset-inline-start: var(--cx-segment-pad, 2px);
  block-size: var(--cx-segment-action-height, 28px);
  inline-size: calc(
    (100% - (2 * var(--cx-segment-pad, 2px))) / var(--cx-segment-count, 1)
  );
  border-radius: 9999px;
  pointer-events: none;
  transform: translateX(
    calc(var(--cx-segment-index, 0) * 100% * var(--cx-segment-dir, 1))
  );
  transition:
    transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1),
    background-color 150ms ease,
    box-shadow 150ms ease;
}

[data-slot="segment"]:dir(rtl) {
  --cx-segment-dir: -1;
}

[data-slot="segment"][data-variant="default"] [data-slot="segment-thumb"] {
  background: var(--p-color-bg-surface, #ffffff);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.04);
}

[data-slot="segment"][data-variant="primary"] [data-slot="segment-thumb"] {
  background: var(--p-color-bg-fill-brand, #303030);
  box-shadow: none;
}

[data-slot="segment"][data-has-selection="false"] [data-slot="segment-thumb"] {
  opacity: 0;
}

[data-slot="segment-option"] {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  block-size: var(--cx-segment-action-height, 28px);
  min-block-size: var(--cx-segment-action-height, 28px);
  margin: 0;
  padding-block: 0;
  padding-inline: var(--cx-segment-padding-inline, 14px);
  border: 0;
  border-radius: 9999px;
  background: transparent;
  color: var(--p-color-text-secondary, #616161);
  font: inherit;
  font-size: var(--cx-segment-font-size, 0.8125rem);
  font-weight: var(--p-font-weight-medium, 550);
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: color 150ms ease;
}

[data-slot="segment-option"]:focus {
  outline: none;
}

[data-slot="segment-option"]:focus-visible {
  box-shadow: inset 0 0 0 2px var(--p-color-border-focus, #005bd3);
}

[data-slot="segment-option"][aria-checked="true"] {
  color: var(--p-color-text, #303030);
}

[data-slot="segment"][data-variant="primary"] [data-slot="segment-option"][aria-checked="true"] {
  color: var(--p-color-text-brand-on-bg-fill, #ffffff);
}

[data-slot="segment-option"]:disabled,
[data-slot="segment"][data-disabled="true"] [data-slot="segment-option"] {
  cursor: not-allowed;
  opacity: 0.5;
}

[data-slot="segment"][data-disabled="true"] {
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="segment-thumb"],
  [data-slot="segment-option"] {
    transition: none;
  }
}
`;
