/**
 * Scoped styles for IndexTable. The table is built from plain elements on one
 * CSS grid (rows are `subgrid`), so hover, rounded selected rows, sticky cells
 * and drag feedback are all plain CSS rather than per-cell React state.
 *
 * Every colour is a custom property with the Shopify admin value as fallback, so
 * an app can retheme the table by setting `--cx-it-*` on any ancestor.
 */
export const INDEX_TABLE_CSS = `
.cx-it {
  --cx-it-radius: 8px;
  --cx-it-border: var(--cx-it-border-color, #ebebeb);
  --cx-it-surface: var(--cx-it-surface-color, #ffffff);
  --cx-it-header: var(--cx-it-header-color, #f7f7f7);
  --cx-it-hover: var(--cx-it-hover-color, #f7f7f7);
  --cx-it-zebra: var(--cx-it-zebra-color, #fbfbfb);
  --cx-it-selected: var(--cx-it-selected-color, #f1f1f1);
  --cx-it-selected-hover: var(--cx-it-selected-hover-color, #ebebeb);
  --cx-it-text: var(--cx-it-text-color, #303030);
  --cx-it-text-subdued: var(--cx-it-text-subdued-color, #616161);
  --cx-it-icon: var(--cx-it-icon-color, #8a8a8a);
  --cx-it-focus: var(--cx-it-focus-color, #005bd3);
  /* What sits behind the table; shows in the corners of pinned cells. */
  --cx-it-backdrop: var(--cx-it-backdrop-color, var(--cx-it-surface));
  --cx-it-scrollbar-thumb: var(--cx-it-scrollbar-thumb-color, rgba(0, 0, 0, 0.28));
  --cx-it-scrollbar-thumb-hover: var(--cx-it-scrollbar-thumb-hover-color, rgba(0, 0, 0, 0.55));
  --cx-it-scrollbar-track: var(--cx-it-scrollbar-track-color, rgba(0, 0, 0, 0.05));
  position: relative;
  color: var(--cx-it-text);
  font-size: 0.8125rem;
  line-height: 1.25rem;
}

@media (prefers-color-scheme: dark) {
  .cx-it {
    --cx-it-scrollbar-thumb: var(--cx-it-scrollbar-thumb-color, rgba(255, 255, 255, 0.35));
    --cx-it-scrollbar-thumb-hover: var(--cx-it-scrollbar-thumb-hover-color, rgba(255, 255, 255, 0.65));
    --cx-it-scrollbar-track: var(--cx-it-scrollbar-track-color, rgba(255, 255, 255, 0.08));
  }
}

.cx-it__scroll {
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--cx-it-scrollbar-thumb) var(--cx-it-scrollbar-track);
}
.cx-it__scroll:hover {
  scrollbar-color: var(--cx-it-scrollbar-thumb-hover) var(--cx-it-scrollbar-track);
}
.cx-it__scroll::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.cx-it__scroll::-webkit-scrollbar-track {
  background: var(--cx-it-scrollbar-track);
  border-radius: 9999px;
  margin-inline: 4px;
}
.cx-it__scroll::-webkit-scrollbar-thumb {
  background-color: var(--cx-it-scrollbar-thumb);
  border-radius: 9999px;
  border: 1.5px solid transparent;
  background-clip: padding-box;
  min-width: 44px;
  transition: background-color 150ms ease;
}
.cx-it__scroll:hover::-webkit-scrollbar-thumb,
.cx-it__scroll:active::-webkit-scrollbar-thumb,
.cx-it__scroll--scrolling::-webkit-scrollbar-thumb {
  background-color: var(--cx-it-scrollbar-thumb-hover);
}
.cx-it__scroll--scrolling {
  scrollbar-color: var(--cx-it-scrollbar-thumb-hover) var(--cx-it-scrollbar-track);
}
.cx-it__scroll::-webkit-scrollbar-corner {
  background: transparent;
}

.cx-it__grid {
  position: relative;
  display: grid;
  grid-template-columns: var(--cx-it-cols);
  min-width: var(--cx-it-min);
  width: 100%;
}
.cx-it--loading .cx-it__grid { opacity: 0.5; pointer-events: none; }

/* Rows: real elements spanning every column, sharing the table's tracks. */
.cx-it__row {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  position: relative;
  background-color: var(--cx-it-row-bg);
  background-clip: padding-box;
}

.cx-it__row--head { --cx-it-row-bg: var(--cx-it-header); }
.cx-it__row--head,
.cx-it__bulk {
  border-radius: var(--cx-it-radius);
  height: 30px;
  padding: 0;
}

/* Header and bulk bar live outside the scroller, so sticky follows the page. */
.cx-it__head {
  position: relative;
  z-index: 10;
  background-color: var(--cx-it-surface);
}
.cx-it__head--sticky {
  position: sticky;
  top: var(--cx-it-sticky-top, 0px);
  box-shadow: 0px -2px 0px 0px #ffffff;
}
/* Mirrors the body's horizontal scroll (synced in JS); no scrollbar of its own. */
.cx-it__head-scroll {
  overflow: hidden;
}
.cx-it__bulk { background-color: var(--cx-it-header); }

/* Divider between body rows. A transparent border keeps the 1px gap, which
   is what separates rounded hovered/selected rows. */
.cx-it__row--body {
  --cx-it-row-bg: var(--cx-it-surface);
  border-top: 1px solid var(--cx-it-border);
}
.cx-it__row--body:first-child { border-top-color: transparent; }
.cx-it__row--zebra { --cx-it-row-bg: var(--cx-it-zebra); }
.cx-it__row--clickable { cursor: pointer; }

.cx-it__row--body:hover { --cx-it-row-bg: var(--cx-it-hover); }
/* Highlighted rows (\`tone\` / \`backgroundColor\`). Selection still wins. */
.cx-it__row--tone-info { --cx-it-row-tone: var(--cx-it-tone-info-color, #eaf4ff); }
.cx-it__row--tone-success { --cx-it-row-tone: var(--cx-it-tone-success-color, #cdfee1); }
.cx-it__row--tone-warning { --cx-it-row-tone: var(--cx-it-tone-warning-color, #fff1e3); }
.cx-it__row--tone-caution { --cx-it-row-tone: var(--cx-it-tone-caution-color, #fff8db); }
.cx-it__row--tone-critical { --cx-it-row-tone: var(--cx-it-tone-critical-color, #fee8eb); }
.cx-it__row--tone-magic { --cx-it-row-tone: var(--cx-it-tone-magic-color, #f5f0ff); }
.cx-it__row--tone-neutral { --cx-it-row-tone: var(--cx-it-tone-neutral-color, #f1f1f1); }
.cx-it__row--toned { --cx-it-row-bg: var(--cx-it-row-tone); }
.cx-it__row--toned:hover { --cx-it-row-bg: color-mix(in srgb, var(--cx-it-row-tone) 94%, #000000); }
.cx-it__row--body[aria-selected="true"] { --cx-it-row-bg: var(--cx-it-selected); }
.cx-it__row--body[aria-selected="true"]:hover { --cx-it-row-bg: var(--cx-it-selected-hover); }

.cx-it__row--body:is(:hover, [aria-selected="true"], .cx-it__row--toned) {
  border-radius: var(--cx-it-radius);
  border-top-color: transparent;
}
.cx-it__row--body:is(:hover, [aria-selected="true"], .cx-it__row--toned) + .cx-it__row--body {
  border-top-color: transparent;
}

/*
 * Pinned cells. While the table scrolls, what lies under a pinned cell is the
 * middle of its own row — same colour, square — so rounding the cell alone
 * would show nothing. Instead the cell paints the backdrop, and a ::before
 * layer repaints the row colour with the rounded corners on top of it.
 */
.cx-it__row:is(.cx-it__row--head, :hover, [aria-selected="true"], .cx-it__row--toned)
  > .cx-it__cell--sticky:first-child::before {
  border-start-start-radius: var(--cx-it-radius);
  border-end-start-radius: var(--cx-it-radius);
}
.cx-it__row:is(.cx-it__row--head, :hover, [aria-selected="true"], .cx-it__row--toned)
  > .cx-it__cell--sticky:last-child::before {
  border-start-end-radius: var(--cx-it-radius);
  border-end-end-radius: var(--cx-it-radius);
}

/*
 * Rows wider than the scroller are cut at its edges, so their own rounded
 * corners sit out of view. Clip highlighted rows to the visible part instead
 * (offsets set from the scroll position in JS) and round that.
 */
.cx-it__row:is(.cx-it__row--head, .cx-it__row--body:hover, [aria-selected="true"], .cx-it__row--toned) {
  clip-path: inset(
    0 var(--cx-it-clip-end, 0px) 0 var(--cx-it-clip-start, 0px) round var(--cx-it-radius)
  );
}

/* Drag to reorder: the row floats under the pointer; its slot becomes a placeholder. */
.cx-it__grid--dragging { cursor: grabbing; user-select: none; }
.cx-it__grid--dragging .cx-it__row--body { pointer-events: none; }
.cx-it__row--floating {
  --cx-it-row-bg: var(--cx-it-surface);
  z-index: 5;
  border-top-color: transparent;
  border-radius: var(--cx-it-radius);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 8px 20px -4px rgba(0, 0, 0, 0.22);
  pointer-events: none;
  cursor: grabbing;
}
.cx-it__row--floating > .cx-it__cell--sticky { background-color: transparent; }
.cx-it__row--placeholder {
  --cx-it-row-bg: var(--cx-it-hover);
  border-top-color: transparent;
  border-radius: var(--cx-it-radius);
  outline: 1px dashed var(--cx-it-placeholder-color, #b5b5b5);
  outline-offset: -1px;
}
.cx-it__row--placeholder > * { visibility: hidden; }
.cx-it__row--placeholder + .cx-it__row--body { border-top-color: transparent; }

/*
 * Sub-rows sit in an animated wrapper (see IndexTable's Transition). It is a
 * subgrid spanning every column, so the rows inside still share the table's
 * tracks; the rules below carry the row dividers across its edges.
 */
.cx-it__subrows {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}
.cx-it__subrows > .cx-it__row--body:first-child { border-top-color: var(--cx-it-border); }
.cx-it__row--body:is(:hover, [aria-selected="true"], .cx-it__row--toned) + .cx-it__subrows > .cx-it__row--body:first-child,
.cx-it__subrows > .cx-it__row--body:first-child:is(:hover, [aria-selected="true"], .cx-it__row--toned) {
  border-top-color: transparent;
}
.cx-it__subrows:has(> .cx-it__row--body:last-child:is(:hover, [aria-selected="true"], .cx-it__row--toned))
  + .cx-it__row--body {
  border-top-color: transparent;
}
@media (prefers-reduced-motion: reduce) {
  .cx-it__subrows { transition: none !important; }
}

/* Cells */
.cx-it__cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: var(--cx-it-col-max, var(--cx-it-cell-max-width, 260px));
  padding: 8px;
  min-height: 30px;
  word-break: normal;
  overflow-wrap: break-word;
}
.cx-it--dense .cx-it__cell { padding-block: 4px; }
.cx-it--align-top .cx-it__cell { align-items: flex-start; }
.cx-it--align-bottom .cx-it__cell { align-items: flex-end; }
.cx-it--align-baseline .cx-it__cell { align-items: baseline; }
.cx-it--truncate .cx-it__cell { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cx-it--truncate .cx-it__cell > * { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cx-it__cell--center { justify-content: center; text-align: center; }
.cx-it__cell--end { justify-content: flex-end; text-align: end; }
.cx-it__cell--flush { padding: 0; max-width: none; }
.cx-it__cell--control { padding-inline: 0; justify-content: center; max-width: none; }
.cx-it__cell--select { cursor: default; max-width: none; }
.cx-it__cell--sticky {
  position: sticky;
  z-index: 1;
  background-color: var(--cx-it-backdrop);
}
.cx-it__cell--sticky::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--cx-it-row-bg);
}
.cx-it__cell--head {
  color: var(--cx-it-text-subdued);
  font-size: 0.75rem;
  font-weight: 550;
  white-space: nowrap;
  max-width: none;
}
.cx-it__cell > * {
  min-width: 0;
}
.cx-it__cell > s-text,
.cx-it__cell > span,
.cx-it__cell > p,
.cx-it__cell > a {
  overflow-wrap: break-word;
  word-break: normal;
  white-space: normal;
}

/* Small inline controls: sort toggle, drag handle, expand toggle. */
.cx-it__control {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
  color: inherit;
}
.cx-it__control:focus-visible { outline: 2px solid var(--cx-it-focus); outline-offset: 1px; }
.cx-it__control--icon { padding: 2px; color: var(--cx-it-icon); }
.cx-it__control--icon:hover { background-color: rgba(0, 0, 0, 0.06); color: var(--cx-it-text); }

.cx-it__handle { cursor: grab; touch-action: none; }
.cx-it__handle:active { cursor: grabbing; }
.cx-it__row--body:not(:hover) .cx-it__handle { opacity: 0.55; }

.cx-it__sort:hover { color: var(--cx-it-text); }
.cx-it__sort-icon { display: inline-flex; opacity: 0; transition: opacity 120ms ease; }
.cx-it__sort:hover .cx-it__sort-icon,
.cx-it__sort--active .cx-it__sort-icon { opacity: 1; }
.cx-it__sort--active { color: var(--cx-it-text); }

.cx-it__indent { flex: none; }

/* Bulk bar (replaces the header row while rows are selected). */
.cx-it__bulk {
  display: flex;
  align-items: center;
  padding-block: 2px;
  padding-inline: calc(8px + var(--cx-it-lead, 0px)) 12px;
}

/* No borders around footer and pagination. */
.cx-it__pagination { display: flex; justify-content: left; padding: 12px 8px; }
.cx-it__footer { display: flex; justify-content: center; padding: 12px 8px; }
.cx-it__empty { padding: 24px 16px; }
`;
