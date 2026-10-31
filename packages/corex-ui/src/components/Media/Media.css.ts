/**
 * Injected once per document. Layout + selection/hover chrome for the Media
 * compound — grid/list views, image-overlaid marks, action chips, split body.
 */
export const MEDIA_STYLE_ID = "cx-media-styles";

export const MEDIA_CSS = `
[data-slot="media"] {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--p-space-base, 16px);
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 0;
}

[data-slot="media-toolbar"] {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--p-space-small-100, 8px);
  inline-size: 100%;
  flex: 0 0 auto;
}

[data-slot="media-filters"] {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--p-space-small-100, 8px);
  inline-size: 100%;
}

[data-slot="media-upload"] {
  box-sizing: border-box;
  display: block;
  inline-size: 100%;
  flex: 0 0 auto;
}

[data-slot="media-upload"][data-variant="dashed"] {
  border: var(--p-border-width-025, 1px) dashed var(--p-color-border, #8a8a8a);
  border-radius: var(--p-border-radius-200, 8px);
  padding: var(--p-space-large-100, 20px) var(--p-space-base, 16px);
  background: var(--p-color-bg-surface, #fff);
  text-align: center;
}

[data-slot="media-body"] {
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  gap: 0;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 0;
  flex: 1 1 auto;
  overflow: hidden;
}

[data-slot="media-body"] > [data-slot="media-content"],
[data-slot="media-body"] > [data-slot="media-main"] {
  flex: 1 1 auto;
  min-inline-size: 0;
  min-block-size: 0;
}

[data-slot="media-body"] > [data-slot="media-detail"] {
  flex: 0 0 auto;
  align-self: stretch;
}

[data-slot="media-content"] {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  max-block-size: var(--cx-media-content-max, none);
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

[data-slot="media-content"][data-view="grid"] {
  display: grid;
  grid-template-columns: var(
    --cx-media-grid-cols,
    repeat(auto-fill, minmax(var(--cx-media-col-min, 9.5rem), 1fr))
  );
  gap: var(--p-space-small-100, 8px) var(--p-space-base, 16px);
  align-content: start;
  padding-block-end: var(--p-space-small-100, 8px);
}

[data-slot="media-content"][data-view="list"] {
  display: flex;
  flex-direction: column;
  gap: 0;
}

[data-slot="media-empty"] {
  box-sizing: border-box;
  inline-size: 100%;
  padding-block: var(--p-space-large-400, 40px);
  text-align: center;
}

/* —— Detail panel —— */
[data-slot="media-detail"] {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--p-space-base, 16px);
  inline-size: var(--cx-media-detail-size, 18rem);
  max-inline-size: var(--cx-media-detail-max, 22rem);
  min-inline-size: 0;
  min-block-size: 0;
  flex: 0 0 auto;
  padding: var(--p-space-base, 16px);
  border-inline-start: var(--p-border-width-025, 1px) solid var(--p-color-border, #e3e3e3);
  background: var(--p-color-bg-surface, #fff);
  overflow: auto;
}

[data-slot="media-detail-header"] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--p-space-small-100, 8px);
  flex: 0 0 auto;
}

[data-slot="media-detail-heading"] {
  font-size: var(--p-font-size-350, 0.875rem);
  font-weight: var(--p-font-weight-semibold, 650);
  line-height: var(--p-font-line-height-500, 1.25rem);
  color: var(--p-color-text, #303030);
  margin: 0;
}

[data-slot="media-detail-body"] {
  display: flex;
  flex-direction: column;
  gap: var(--p-space-base, 16px);
  min-inline-size: 0;
  flex: 1 1 auto;
}

[data-slot="media-detail"] [data-slot="media-preview"] {
  aspect-ratio: 1 / 1;
  inline-size: 100%;
  border-radius: var(--p-border-radius-200, 8px);
}

/* Hide Selectable outline — Media uses surface highlight. */
.cx-selectable:has(> [data-slot="media-item"]) > .cx-selectable__ring {
  display: none;
}

/* Always-visible selection mark over the thumbnail (grid) / left of row (list). */
.cx-selectable:has(> [data-slot="media-item"]) > .cx-selectable__badge[data-indicator="checkbox"],
.cx-selectable:has(> [data-slot="media-item"]) > .cx-selectable__badge[data-indicator="radio"] {
  opacity: 1;
  transform: scale(1);
  z-index: 2;
  background: color-mix(in srgb, #fff 94%, transparent);
  color: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #000 28%, transparent);
  transition:
    opacity 150ms ease,
    transform 150ms ease,
    background 150ms ease,
    color 150ms ease,
    box-shadow 150ms ease;
}

.cx-selectable--selected:has(> [data-slot="media-item"]) > .cx-selectable__badge[data-indicator="checkbox"],
.cx-selectable--selected:has(> [data-slot="media-item"]) > .cx-selectable__badge[data-indicator="radio"] {
  background: var(--cx-sel-color, #0a0a0a);
  color: #fff;
  box-shadow: 0 0 0 1.5px color-mix(in srgb, #fff 90%, transparent);
}

.cx-selectable--selected:has(> [data-slot="media-item"]) > .cx-selectable__badge[data-indicator="radio"] .cx-selectable__badge-dot {
  background: currentColor;
}

/* Grid: pin the mark to the image corner (item padding + inset). */
.cx-selectable:has(> [data-slot="media-item"][data-view="grid"]) > .cx-selectable__badge {
  inset-block-start: calc(var(--p-space-small-300, 4px) + 6px);
  inset-inline-start: calc(var(--p-space-small-300, 4px) + 6px);
}

/* List: mark sits left of the thumbnail. */
.cx-selectable:has(> [data-slot="media-item"][data-view="list"]) > .cx-selectable__badge {
  inset-block-start: 50%;
  inset-inline-start: 10px;
  transform: translateY(-50%) scale(1);
}

.cx-selectable--selected:has(> [data-slot="media-item"][data-view="list"]) > .cx-selectable__badge {
  transform: translateY(-50%) scale(1);
}

[data-slot="media-item"] {
  box-sizing: border-box;
  display: flex;
  gap: var(--p-space-small-200, 6px);
  border-radius: var(--p-border-radius-200, 8px);
  padding: var(--p-space-small-300, 4px);
  transition: background-color 150ms ease;
  min-inline-size: 0;
}

[data-slot="media-item"][data-view="grid"] {
  flex-direction: column;
  align-items: stretch;
}

[data-slot="media-item"][data-view="list"] {
  flex-direction: row;
  align-items: center;
  padding-block: var(--p-space-small-200, 6px);
  padding-inline: var(--p-space-small-100, 8px);
  padding-inline-start: 2.25rem;
  gap: var(--p-space-base, 16px);
  border-radius: var(--p-border-radius-150, 6px);
}

.cx-selectable--interactive:not(.cx-selectable--disabled):hover > [data-slot="media-item"],
.cx-hoverable[data-hovered="true"] .cx-selectable > [data-slot="media-item"] {
  background: var(--p-color-bg-surface-secondary, #f1f1f1);
}

.cx-selectable--selected > [data-slot="media-item"] {
  background: var(--p-color-bg-surface-secondary, #f1f1f1);
}

.cx-selectable:focus-visible > [data-slot="media-item"] {
  outline: 2px solid var(--p-color-border-focus, #005bd3);
  outline-offset: 2px;
}

[data-slot="media-preview"] {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: var(--p-border-radius-150, 6px);
  background: var(--p-color-bg-surface-secondary, #f1f1f1);
  min-inline-size: 0;
}

[data-slot="media-item"][data-view="grid"] [data-slot="media-preview"] {
  aspect-ratio: var(--cx-media-preview-ratio, 1 / 1);
  inline-size: 100%;
}

[data-slot="media-item"][data-view="list"] [data-slot="media-preview"] {
  inline-size: 2.5rem;
  block-size: 2.5rem;
  flex: 0 0 auto;
  aspect-ratio: auto;
}

[data-slot="media-preview"] > img,
[data-slot="media-preview"] > s-image,
[data-slot="media-preview"] > s-thumbnail {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: var(--cx-media-preview-fit, cover);
  object-position: center;
}

/* Floating hover actions (eye chip) */
[data-slot="media-actions"] {
  box-sizing: border-box;
  position: absolute;
  inset-block-end: var(--p-space-small-200, 6px);
  inset-inline-end: var(--p-space-small-200, 6px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--p-space-small-300, 4px);
}

[data-slot="media-item"][data-view="list"] [data-slot="media-actions"] {
  position: static;
  inset: auto;
  margin-inline-start: auto;
}

[data-slot="media-action-chip"] {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: var(--p-border-radius-100, 4px);
  background: var(--p-color-bg-surface, #fff);
  color: var(--p-color-text-info, #005bd3);
  box-shadow:
    0 0 0 1px color-mix(in srgb, #000 8%, transparent),
    0 1px 2px color-mix(in srgb, #000 12%, transparent);
  cursor: pointer;
  transition: background 120ms ease, transform 120ms ease, box-shadow 120ms ease;
}

[data-slot="media-action-chip"]:hover {
  background: var(--p-color-bg-surface-secondary, #f6f6f6);
}

[data-slot="media-action-chip"]:focus-visible {
  outline: 2px solid var(--p-color-border-focus, #005bd3);
  outline-offset: 2px;
}

[data-slot="media-action-chip"]:active {
  transform: scale(0.96);
}

[data-slot="media-action-chip"] svg {
  display: block;
  inline-size: 1rem;
  block-size: 1rem;
}

[data-slot="media-meta"] {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0;
  min-inline-size: 0;
  padding-inline: var(--p-space-small-400, 2px);
  padding-block-end: var(--p-space-small-400, 2px);
  font-size: var(--p-font-size-325, 0.8125rem);
  line-height: var(--p-font-line-height-400, 1.25rem);
  color: var(--p-color-text, #303030);
}

[data-slot="media-item"][data-view="list"] [data-slot="media-meta"] {
  flex: 1 1 auto;
  flex-direction: row;
  align-items: center;
  gap: var(--p-space-base, 16px);
  padding: 0;
}

[data-slot="media-item"][data-view="list"] [data-slot="media-meta-name"] {
  flex: 1 1 auto;
}

[data-slot="media-meta-name"] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-inline-size: 0;
  font-weight: var(--p-font-weight-regular, 450);
}

[data-slot="media-meta-type"],
[data-slot="media-meta-orientation"],
[data-slot="media-meta-date"] {
  flex: 0 0 auto;
  color: var(--p-color-text-secondary, #616161);
  font-size: var(--p-font-size-300, 0.75rem);
}

[data-slot="media-item"][data-view="grid"] [data-slot="media-meta-orientation],
[data-slot="media-item"][data-view="grid"] [data-slot="media-meta-date] {
  display: none;
}

[data-slot="media-item"][data-view="list"] [data-slot="media-meta-type"] {
  min-inline-size: 2.5rem;
}

[data-slot="media-item"][data-view="list"] [data-slot="media-meta-orientation"] {
  min-inline-size: 5rem;
}

[data-slot="media-item"][data-view="list"] [data-slot="media-meta-date"] {
  margin-inline-start: auto;
  min-inline-size: 3.5rem;
  text-align: end;
}

[data-slot="media-trigger"] {
  display: contents;
}

[data-slot="media-view-toggle"] {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  margin: 0;
  border: var(--p-border-width-025, 1px) solid var(--p-color-border, #8a8a8a);
  border-radius: var(--p-border-radius-200, 8px);
  background: var(--p-color-bg-surface, #fff);
  color: var(--p-color-text, #303030);
  cursor: pointer;
}

[data-slot="media-view-toggle"]:hover {
  background: var(--p-color-bg-surface-secondary, #f1f1f1);
}

[data-slot="media-view-toggle"]:focus-visible {
  outline: 2px solid var(--p-color-border-focus, #005bd3);
  outline-offset: 2px;
}

[data-slot="media-view-toggle"] svg {
  display: block;
  inline-size: 1rem;
  block-size: 1rem;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="media-item"],
  [data-slot="media-action-chip"],
  .cx-selectable:has(> [data-slot="media-item"]) > .cx-selectable__badge {
    transition: none;
  }
}
`;
