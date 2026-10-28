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
  /* Page behind the table — pinned header cells use this while content scrolls
     under them (body pins use the row colour instead). */
  --cx-it-backdrop: var(--cx-it-backdrop-color, #f1f1f1);
  /* Header row (and the bulk bar that replaces it): always the subdued grey. */
  --cx-it-head-bg: var(--cx-it-header-background-color, var(--cx-it-backdrop));
  /* Header and bulk bar height; dense is 4px tighter. Both fit a 24px checkbox. */
  --cx-it-head-height: var(--cx-it-header-height, 32px);
  position: relative;
  color: var(--cx-it-text);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  /* Keep trackpad overscroll from becoming the browser's back/forward swipe. */
  overscroll-behavior-x: none;
}

.cx-it--dense { --cx-it-head-height: var(--cx-it-header-height-dense, 28px); }

/*
 * Sizes below assume border-box. Set it here rather than relying on the host
 * app's CSS reset: without one, padding is added on top of every height and
 * min-height, and the fixed-height header cells overflow and get clipped.
 */
.cx-it,
.cx-it__scroll,
.cx-it__head,
.cx-it__head-scroll,
.cx-it__grid,
.cx-it__row,
.cx-it__subrows,
.cx-it__cell,
.cx-it__cell::before,
.cx-it__bulk,
.cx-it__pagination,
.cx-it__footer,
.cx-it__empty {
  box-sizing: border-box;
}

/*
 * Body scroller. Rounded corners here clip the white row surface (including
 * sticky cells) against the page backdrop — row-level border-radius alone is
 * covered by opaque sticky pins on the left/right edges.
 *
 * Native scrollbar only (no custom thumb/track). Overlay scrollbars stay
 * hidden until scroll; always-on bars use the browser default.
 */
.cx-it__scroll {
  overflow-x: auto;
  border-radius: var(--cx-it-radius);
  /* none (not contain): Chrome's history swipe still fires with contain
     once scrollLeft is already 0 and the gesture continues left. */
  overscroll-behavior-x: none;
  scrollbar-width: none;
}
.cx-it__scroll::-webkit-scrollbar {
  display: none;
}

/*
 * The grid takes its content's width — each content-sized column as wide as
 * its content needs, up to its max — and fills the container when that is
 * narrower (the flexible column takes the rest). Wider than the container,
 * the body scrolls sideways instead of wrapping cells below their max.
 */
.cx-it__grid {
  position: relative;
  display: grid;
  grid-template-columns: var(--cx-it-cols);
  width: max-content;
  min-width: max(100%, var(--cx-it-min));
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

/* Headings sit on a filled grey pill. */
.cx-it__row--head { --cx-it-row-bg: var(--cx-it-head-bg); }
.cx-it__row--head,
.cx-it__bulk {
  border-radius: var(--cx-it-radius);
  height: var(--cx-it-head-height);
  min-height: var(--cx-it-head-height);
  max-height: var(--cx-it-head-height);
  padding: 0;
}

/* Header and bulk bar live outside the scroller, so sticky follows the page. */
.cx-it__head {
  position: relative;
  z-index: 10;
  background-color: transparent;
}
.cx-it__head--sticky {
  position: sticky;
  top: var(--cx-it-sticky-top, 0px);
}
/* Mirrors the body's horizontal scroll (synced in JS); no scrollbar of its own. */
.cx-it__head-scroll {
  overflow: hidden;
}
.cx-it__bulk { background-color: var(--cx-it-head-bg); }

/* Divider between body rows. A transparent border keeps the 1px gap, which
   is what separates rounded hovered/selected rows. The first body row keeps
   it in the surface colour (see below) — transparent left a 1px gap that read
   as a rule under the headings against the page background.
 *
 * Resting rows are clipped to a rounded surface by .cx-it__scroll (sticky pins
 * would otherwise paint square corners). Hover / selected / toned still get a
 * full pill radius of their own. */
.cx-it__row--body {
  --cx-it-row-bg: var(--cx-it-surface);
  border-top: 1px solid var(--cx-it-border);
}
.cx-it__row--zebra { --cx-it-row-bg: var(--cx-it-zebra); }
.cx-it__row--clickable { cursor: pointer; }

.cx-it__row--body:hover { --cx-it-row-bg: var(--cx-it-hover); }
/* Highlighted rows (\`tone\` / \`background\`). Selection still wins. */
/* Tone colours: IconTile's \`base\` tones, mixed with 70% white. */
.cx-it__row--tone-info { --cx-it-row-tone: var(--cx-it-tone-info-color, #e0f6fe); }
.cx-it__row--tone-success { --cx-it-row-tone: var(--cx-it-tone-success-color, #ebfdd8); }
.cx-it__row--tone-warning { --cx-it-row-tone: var(--cx-it-tone-warning-color, #fceddc); }
.cx-it__row--tone-caution { --cx-it-row-tone: var(--cx-it-tone-caution-color, #fef5da); }
.cx-it__row--tone-critical { --cx-it-row-tone: var(--cx-it-tone-critical-color, #fdf2f0); }
.cx-it__row--tone-neutral { --cx-it-row-tone: var(--cx-it-tone-neutral-color, #f5f5f5); }
.cx-it__row--tone-subdued { --cx-it-row-tone: var(--cx-it-tone-subdued-color, #f8f8f8); }
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
/* The rule under the headings is always the table surface, whatever the
   first row's state, so it never shows the page backdrop through the gap. */
.cx-it__grid > .cx-it__row--body:first-child,
.cx-it__grid > .cx-it__row--body:first-child:is(:hover, [aria-selected="true"], .cx-it__row--toned) {
  border-top-color: var(--cx-it-surface);
}

/*
 * Pinned cells. Paint the row colour (opaque) so scrolled siblings cannot show
 * through. ::before carries the rounded corners on highlighted rows — those
 * need a layer that can round independently of the square pin stack.
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
 * (offsets set from the scroll position in JS) and round that. Resting rows
 * rely on .cx-it__scroll border-radius for the same edge clip.
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
/* The flexible column's natural width: its content, up to this. Any space
   left in the container still goes to it. */
.cx-it__cell--flex { max-width: var(--cx-it-flex-max-width, 400px); }
.cx-it__cell--flush { padding: 0; }
.cx-it__cell--control { padding-inline: 0; justify-content: center; }
.cx-it__cell--select { cursor: default; }
.cx-it__cell--sticky {
  position: sticky;
  z-index: 3;
  isolation: isolate;
  /* Same fill as the row — never transparent, or scrolled cells bleed through. */
  background-color: var(--cx-it-row-bg);
}
.cx-it__cell--sticky::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--cx-it-row-bg);
  pointer-events: none;
}
/* Soft edge when content sits under a pin. Only the outer pin of each side.
   The clip keeps the blur to the inner side, so it never bleeds above or
   below the rows (e.g. under the last row or a sub-row group). */
.cx-it--scrolled-start .cx-it__cell--sticky-left:has(+ :not(.cx-it__cell--sticky-left)) {
  box-shadow: 6px 0 10px -4px rgba(0, 0, 0, 0.1);
  clip-path: inset(0 -16px 0 0);
}
.cx-it--scrolled-end .cx-it__cell:not(.cx-it__cell--sticky-right) + .cx-it__cell--sticky-right {
  box-shadow: -6px 0 10px -4px rgba(0, 0, 0, 0.1);
  clip-path: inset(0 0 0 -16px);
}
/* Header cells fill the fixed-height row exactly: no block padding or
   min-height to push their content (sort button, checkbox) past it. */
.cx-it .cx-it__row--head > .cx-it__cell {
  height: var(--cx-it-head-height);
  min-height: 0;
  padding-block: 0;
}
.cx-it__cell--head {
  color: var(--cx-it-text-subdued);
  font-size: 0.75rem;
  font-weight: 550;
  white-space: nowrap;
}

/* Zero-height row in the body grid that sizes the columns for the headings
   (see IndexTable's sizerRow). */
.cx-it__sizer {
  height: 0;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
}
.cx-it .cx-it__sizer > .cx-it__cell {
  height: 0;
  min-height: 0;
  padding-block: 0;
}
/* Stand-ins for the heading's title, sort icon (16px + 4px gap) and badge. */
.cx-it__sizer > [data-title]::before { content: attr(data-title); }
.cx-it__sizer > [data-sortable]::before { padding-inline-end: 20px; }
.cx-it__sizer > [data-badge]::after {
  content: attr(data-badge);
  padding-inline: var(--cx-it-sizer-badge-padding, 8px);
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
/*
 * Shared gutter for the expand chevron. Sized to the icon control (20px glyph
 * + 2px padding each side) so first-column titles align whether or not that
 * row itself has subRows.
 */
.cx-it__expand {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 24px;
  block-size: 24px;
}

/*
 * Linked scrolling. The header is outside the body's scroller, so by default
 * IndexTable copies the body's scrollLeft onto it from a scroll listener,
 * which lands a frame after the body moved. Where scroll-driven animations
 * exist, the header instead follows the body's scroll timeline, on the same
 * frame. \`--cx-it-scroll-max\` (the body's scroll range) is set from JS.
 *  - The header grid slides left by the scrolled distance.
 *  - Its pinned cells slide back, as the header itself no longer scrolls.
 *  - The \`--cx-it-clip-*\` insets that round highlighted rows follow too.
 */
@property --cx-it-clip-start { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --cx-it-clip-end { syntax: "<length>"; inherits: true; initial-value: 0px; }
@keyframes cx-it-follow-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-1 * var(--cx-it-scroll-max, 0px))); }
}
@keyframes cx-it-hold-pinned {
  from { transform: translateX(0); }
  to { transform: translateX(var(--cx-it-scroll-max, 0px)); }
}
@keyframes cx-it-clip-scrolled {
  from { --cx-it-clip-start: 0px; --cx-it-clip-end: var(--cx-it-scroll-max, 0px); }
  to { --cx-it-clip-start: var(--cx-it-scroll-max, 0px); --cx-it-clip-end: 0px; }
}
.cx-it--scroll-linked:dir(ltr) { timeline-scope: --cx-it-scroll; }
.cx-it--scroll-linked:dir(ltr) .cx-it__scroll { scroll-timeline: --cx-it-scroll inline; }
.cx-it--scroll-linked:dir(ltr) > [role="table"] {
  animation: cx-it-clip-scrolled linear both;
  animation-timeline: --cx-it-scroll;
}
.cx-it--scroll-linked:dir(ltr) .cx-it__head-scroll > .cx-it__grid {
  animation: cx-it-follow-scroll linear both;
  animation-timeline: --cx-it-scroll;
}
.cx-it--scroll-linked:dir(ltr) .cx-it__head-scroll .cx-it__cell--sticky {
  animation: cx-it-hold-pinned linear both;
  animation-timeline: --cx-it-scroll;
}

/* Bulk bar (replaces the header row while rows are selected). */
.cx-it__bulk {
  display: flex;
  align-items: center;
  padding-block: 0;
  padding-inline: calc(8px + var(--cx-it-lead, 0px)) 12px;
}

/* No borders around footer and pagination. */
.cx-it__pagination { display: flex; justify-content: left; padding: 12px 8px; }
.cx-it__pagination--floating {
  position: sticky;
  bottom: var(--cx-it-pagination-offset, 16px);
  z-index: 20;
  pointer-events: none;
}
.cx-it__pagination--floating > * { pointer-events: auto; }
.cx-it__footer { display: flex; justify-content: center; padding: 12px 8px; }
.cx-it__empty { padding: 24px 16px; }
`;
