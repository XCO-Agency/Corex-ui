/**
 * Injected once per document. Styles the Shopify-like rich text shell,
 * toolbar chrome, and contentEditable typography with Polaris tokens.
 */
export const RICH_TEXT_EDITOR_STYLE_ID = "cx-rich-text-editor-styles";

export const RICH_TEXT_EDITOR_CSS = `
[data-slot="rich-text-editor"] {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  border-radius: var(--p-border-radius-400, 16px);
  border: var(--p-border-width-025, 1px) solid var(--p-color-border, #e1e3e5);
  background: var(--p-color-bg-surface, #ffffff);
  color: var(--p-color-text, #303030);
}

[data-slot="rich-text-editor"][data-disabled="true"] {
  opacity: 0.6;
  pointer-events: none;
}

[data-slot="rich-text-toolbar"] {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--p-space-100, 4px);
  padding: var(--p-space-100, 4px) var(--p-space-200, 8px);
  background: var(--p-color-bg-surface-secondary, #f6f6f7);
  border-bottom: var(--p-border-width-025, 1px) solid var(--p-color-border, #e1e3e5);
}

[data-slot="rich-text-toolbar-group"] {
  display: inline-flex;
  align-items: center;
  gap: var(--p-space-050, 2px);
}

[data-slot="rich-text-tool"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--p-border-radius-200, 8px);
}

[data-slot="rich-text-tool"][data-active="true"] {
  background: var(--p-color-bg-fill-transparent-selected, rgba(0, 0, 0, 0.08));
}

[data-slot="rich-text-toolbar-divider"] {
  width: 1px;
  align-self: stretch;
  margin-block: var(--p-space-100, 4px);
  margin-inline: var(--p-space-100, 4px);
  background: var(--p-color-border, #e1e3e5);
}

[data-slot="rich-text-toolbar-spacer"] {
  flex: 1 1 auto;
  min-width: var(--p-space-200, 8px);
}

[data-slot="rich-text-surface"] {
  box-sizing: border-box;
  position: relative;
  flex: 1 1 auto;
  min-height: var(--rte-min-height, 160px);
  padding: var(--p-space-400, 16px);
  outline: none;
  overflow: auto;
  font-family: var(--p-font-family-sans, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  font-size: var(--p-font-size-350, 0.875rem);
  line-height: var(--p-font-line-height-500, 1.4);
  color: var(--p-color-text, #303030);
  background: var(--p-color-bg-surface, #ffffff);
  white-space: pre-wrap;
  word-break: break-word;
}

[data-slot="rich-text-surface"]:focus-visible {
  box-shadow: inset 0 0 0 2px var(--p-color-border-focus, #005bd3);
}

[data-slot="rich-text-surface"][data-empty="true"]:before {
  content: attr(data-placeholder);
  color: var(--p-color-text-secondary, #8c9196);
  pointer-events: none;
  position: absolute;
  inset-inline-start: var(--p-space-400, 16px);
  inset-block-start: var(--p-space-400, 16px);
}

[data-slot="rich-text-surface"] h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5em;
  line-height: 1.25;
}

[data-slot="rich-text-surface"] h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5em;
  line-height: 1.3;
}

[data-slot="rich-text-surface"] h3 {
  font-size: 1.25rem;
  font-weight: 650;
  margin: 0 0 0.5em;
  line-height: 1.35;
}

[data-slot="rich-text-surface"] h4 {
  font-size: 1.125rem;
  font-weight: 650;
  margin: 0 0 0.5em;
}

[data-slot="rich-text-surface"] h5 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5em;
}

[data-slot="rich-text-surface"] h6 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5em;
  color: var(--p-color-text-secondary, #6d7175);
}

[data-slot="rich-text-surface"] p {
  margin: 0 0 0.75em;
}

[data-slot="rich-text-surface"] blockquote {
  margin: 0 0 0.75em;
  padding-inline-start: var(--p-space-300, 12px);
  border-inline-start: 3px solid var(--p-color-border, #c9cccf);
  color: var(--p-color-text-secondary, #6d7175);
}

[data-slot="rich-text-surface"] ul,
[data-slot="rich-text-surface"] ol {
  margin: 0 0 0.75em;
  padding-inline-start: 1.5em;
}

[data-slot="rich-text-surface"] a {
  color: var(--p-color-text-link, #005bd3);
  text-decoration: underline;
}

[data-slot="rich-text-surface"] img,
[data-slot="rich-text-surface"] video,
[data-slot="rich-text-surface"] iframe {
  max-width: 100%;
  height: auto;
  border-radius: var(--p-border-radius-150, 6px);
}

[data-slot="rich-text-surface"] table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 0.75em;
}

[data-slot="rich-text-surface"] td,
[data-slot="rich-text-surface"] th {
  border: 1px dashed var(--p-color-border, #c9cccf);
  padding: var(--p-space-200, 8px);
  min-width: 3rem;
  vertical-align: top;
}

[data-slot="rich-text-code"] {
  box-sizing: border-box;
  width: 100%;
  min-height: var(--rte-min-height, 160px);
  margin: 0;
  padding: var(--p-space-400, 16px);
  border: none;
  resize: vertical;
  outline: none;
  font-family: var(--p-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
  font-size: var(--p-font-size-325, 0.8125rem);
  line-height: 1.5;
  color: var(--p-color-text, #303030);
  background: var(--p-color-bg-surface, #ffffff);
}

[data-slot="rich-text-code"]:focus-visible {
  box-shadow: inset 0 0 0 2px var(--p-color-border-focus, #005bd3);
}

[data-slot="rich-text-color-swatches"] {
  display: grid;
  grid-template-columns: repeat(5, 1.5rem);
  gap: var(--p-space-150, 6px);
  padding: var(--p-space-200, 8px);
}

[data-slot="rich-text-color-swatch"] {
  box-sizing: border-box;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  padding: 0;
  background: var(--swatch-color);
}

[data-slot="rich-text-color-swatch"]:focus-visible {
  outline: 2px solid var(--p-color-border-focus, #005bd3);
  outline-offset: 2px;
}

[data-slot="rich-text-block-preview-quote"] {
  display: flex;
  align-items: stretch;
  gap: var(--p-space-200, 8px);
}

[data-slot="rich-text-block-preview-quote"]::before {
  content: "";
  width: 3px;
  border-radius: 2px;
  background: var(--p-color-border, #c9cccf);
  flex: 0 0 auto;
}
`;
