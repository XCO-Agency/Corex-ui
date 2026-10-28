/**
 * Injected once per document. Ports the shadcn drawer visuals onto
 * Polaris tokens — flexible edge offset, nested stack scale/peek, and mobile
 * sheet drag affordances — without Tailwind.
 */
export const DRAWER_STYLE_ID = "cx-drawer-styles";

export const DRAWER_CSS = `
/* iOS Safari: absolute overlay needs a positioned body after scroll. */
body {
  position: relative;
}

[data-slot="drawer-overlay"] {
  --drawer-overlay-min-opacity: 0;
  position: fixed;
  inset: 0;
  z-index: var(--p-z-index-layer-modal, 520);
  min-height: 100dvh;
  background: color-mix(in srgb, #000 40%, transparent);
  opacity: max(
    var(--drawer-overlay-min-opacity),
    calc(1 - var(--drawer-swipe-progress, 0))
  );
  transition: opacity 450ms cubic-bezier(0.32, 0.72, 0, 1);
  user-select: none;
  -webkit-user-select: none;
  pointer-events: auto;
}

@supports (backdrop-filter: blur(0)) {
  [data-slot="drawer-overlay"] {
    backdrop-filter: blur(2px);
  }
}

@supports (-webkit-touch-callout: none) {
  [data-slot="drawer-overlay"] {
    position: absolute;
  }
}

[data-slot="drawer-overlay"][data-starting-style],
[data-slot="drawer-overlay"][data-ending-style] {
  opacity: 0;
  pointer-events: none;
}

[data-slot="drawer-overlay"][data-swiping] {
  transition-duration: 0ms;
}

[data-slot="drawer-overlay"][data-ending-style] {
  transition-duration: calc(var(--drawer-swipe-strength, 1) * 400ms);
}

[data-slot="drawer-overlay"][data-snap-points] {
  --drawer-overlay-min-opacity: 0.5;
}

[data-slot="drawer-viewport"] {
  position: fixed;
  inset: 0;
  z-index: var(--p-z-index-layer-modal, 520);
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

[data-slot="drawer-viewport"][data-modal="true"] {
  pointer-events: auto;
}

/* Side-by-side / split layouts keep the parent panel underneath clickable. */
[data-slot="drawer-viewport"][data-variant="aside"],
[data-slot="drawer-viewport"][data-variant="bottom"],
[data-slot="drawer-viewport"][data-variant="overlay"] {
  pointer-events: none;
}

[data-slot="drawer-popup"] {
  --drawer-offset-top: 8px;
  --drawer-offset-right: 8px;
  --drawer-offset-bottom: 8px;
  --drawer-offset-left: 8px;
  --drawer-content-height: var(--drawer-height, auto);
  --drawer-content-max-height: none;
  --drawer-content-width: auto;
  --drawer-surface: var(--p-color-bg-surface, #ffffff);
  --drawer-radius: 16px;
  --peek: 1rem;
  --stack-step: 0.05;
  --stack-height: var(--drawer-frontmost-height, var(--drawer-height, 0px));
  --stack-progress: clamp(0, var(--drawer-swipe-progress, 0), 1);
  --stack-peek-offset: max(
    0px,
    calc((var(--nested-drawers, 0) - var(--stack-progress)) * var(--peek))
  );
  --stack-scale-base: max(0, calc(1 - (var(--nested-drawers, 0) * var(--stack-step))));
  --stack-scale: clamp(
    0,
    calc(var(--stack-scale-base) + (var(--stack-step) * var(--stack-progress))),
    1
  );
  --stack-shrink: calc(1 - var(--stack-scale));
  --translate-x: 0px;
  --translate-y: 0px;
  --closed-transform: translate3d(0, 100%, 0);

  box-sizing: border-box;
  pointer-events: auto;
  position: fixed;
  z-index: var(--p-z-index-layer-modal, 520);
  display: flex;
  flex-direction: column;
  margin-top: var(--drawer-offset-top);
  margin-right: var(--drawer-offset-right);
  margin-bottom: var(--drawer-offset-bottom);
  margin-left: var(--drawer-offset-left);
  height: var(--drawer-content-height);
  max-height: var(--drawer-content-max-height);
  min-height: 0;
  width: var(--drawer-content-width);
  background: var(--drawer-surface);
  color: var(--p-color-text, #303030);
  font-size: var(--p-font-size-325, 0.8125rem);
  outline: none;
  will-change: transform;
  user-select: none;
  -webkit-user-select: none;
  interpolate-size: allow-keywords;
  transform: translate3d(
      var(--translate-x),
      var(--translate-y),
      0
    )
    scale(var(--stack-scale));
  transition:
    transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
    height 450ms cubic-bezier(0.22, 1, 0.36, 1),
    bottom 450ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 450ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 450ms cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: var(--p-shadow-600, 0 4px 16px rgba(0, 0, 0, 0.12));
}

[data-slot="drawer-popup"][data-nested-drawer-open] {
  overflow: hidden;
  filter: brightness(0.95);
}

/*
 * Touch: a sheet owns vertical drags (swipe to dismiss) except inside the
 * body, which keeps native scrolling. Side drawers leave vertical scroll to
 * the browser and take horizontal drags.
 */
[data-slot="drawer-popup"][data-swipe-axis="y"] {
  inset-inline: 0;
  /* Sheets span the viewport (minus offsets): a desktop \`width\` never leaves a side gap. */
  width: auto;
  max-width: none;
  touch-action: none;
  --drawer-content-max-height: calc(100dvh - 6rem);
}

/* Not draggable: the browser keeps its own touch gestures (scroll, zoom). */
[data-slot="drawer-popup"][data-swipeable="false"] {
  touch-action: auto;
}

[data-slot="drawer-popup"][data-swipe-axis="y"][data-snap-points] {
  --drawer-content-height: 100dvh;
}

/*
 * Nested sheets: the parent takes the frontmost sheet's height, so after it
 * scales back and shifts up it peeks out above the new sheet like the desktop
 * stack (instead of hiding fully behind a sheet of equal height).
 */
[data-slot="drawer-popup"][data-swipe-axis="y"][data-nested-drawer-open][data-stack-measured] {
  height: var(--stack-height);
  max-height: none;
}

/*
 * Side drawer (desktop default): stretch top→bottom with per-side offset so the
 * panel floats (shadcn: inset-y-0 + margin + rounded corners).
 * No swipe-handle chrome; swipe works on the full panel surface.
 */
[data-slot="drawer-popup"][data-swipe-axis="x"],
[data-slot="drawer-popup"][data-presentation="drawer"] {
  top: 0;
  /* Moves up while a nested \`bottom\` drawer shares this column. */
  bottom: var(--drawer-push-bottom, 0px);
  height: auto;
  max-height: none;
  --drawer-content-height: auto;
  --drawer-content-max-height: none;
  /* Column without a handle — header / body / footer stack vertically. */
  flex-direction: column;
  touch-action: pan-y;
  --drawer-content-width: 75%;
  /* Presets and custom widths never overflow the viewport (minus edge offsets). */
  max-width: calc(100% - var(--drawer-offset-left) - var(--drawer-offset-right));
}

@media (min-width: 640px) {
  [data-slot="drawer-popup"][data-swipe-axis="x"],
  [data-slot="drawer-popup"][data-presentation="drawer"] {
    --drawer-content-width: 24rem;
  }
}

[data-slot="drawer-popup"][data-swipe-direction="down"] {
  bottom: 0;
  transform-origin: bottom center;
  border-radius: var(--drawer-radius) var(--drawer-radius) 0 0;
  border-block-start: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
  --closed-transform: translate3d(
    0,
    calc(100% + var(--drawer-offset-bottom) + 2px),
    0
  );
  --translate-y: calc(
    var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px) -
      var(--stack-peek-offset) - (var(--stack-shrink) * var(--stack-height))
  );
}

[data-slot="drawer-popup"][data-swipe-direction="up"] {
  top: 0;
  transform-origin: top center;
  border-radius: 0 0 var(--drawer-radius) var(--drawer-radius);
  border-block-end: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
  --closed-transform: translate3d(
    0,
    calc(-100% - var(--drawer-offset-top) - 2px),
    0
  );
  --translate-y: calc(
    var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px) +
      var(--stack-peek-offset) + (var(--stack-shrink) * var(--stack-height))
  );
}

[data-slot="drawer-popup"][data-swipe-direction="left"] {
  left: 0;
  transform-origin: left center;
  border-radius: 0 var(--drawer-radius) var(--drawer-radius) 0;
  border-inline-end: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
  --closed-transform: translate3d(
    calc(-100% - var(--drawer-offset-left) - 2px),
    0,
    0
  );
  --translate-x: calc(
    var(--drawer-swipe-movement-x, 0px) + var(--stack-peek-offset) +
      (var(--stack-shrink) * 100%) + var(--drawer-aside-shift, 0px)
  );
}

[data-slot="drawer-popup"][data-swipe-direction="right"] {
  right: 0;
  transform-origin: right center;
  border-radius: var(--drawer-radius) 0 0 var(--drawer-radius);
  border-inline-start: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
  --closed-transform: translate3d(
    calc(100% + var(--drawer-offset-right) + 2px),
    0,
    0
  );
  --translate-x: calc(
    var(--drawer-swipe-movement-x, 0px) - var(--stack-peek-offset) -
      (var(--stack-shrink) * 100%) - var(--drawer-aside-shift, 0px)
  );
}

/*
 * Nested \`bottom\` drawer: the lower slice of its parent's column (same side,
 * width, offsets and slide). Height follows content or the active snap point
 * (\`--drawer-resize-height\` while dragging); enters from the bottom.
 */
[data-slot="drawer-popup"][data-variant="bottom"] {
  top: auto;
  bottom: var(--drawer-push-bottom, 0px);
  --drawer-content-height: auto;
  --drawer-content-max-height: calc(
    100dvh - var(--drawer-offset-top) - var(--drawer-offset-bottom) - 8rem
  );
  height: var(--drawer-resize-height, var(--drawer-content-height));
  max-height: var(--drawer-content-max-height);
  transform-origin: bottom center;
  --translate-y: var(--drawer-swipe-movement-y, 0px);
  --closed-transform: translate3d(
    var(--translate-x),
    calc(100% + var(--drawer-offset-bottom) + var(--drawer-push-bottom, 0px) + 2px),
    0
  );
}

/*
 * Inner \`aside\` (opened on the parent's inner side): appears from behind the
 * parent with a short slide + fade instead of crossing it from the screen edge.
 */
[data-slot="drawer-popup"][data-variant="aside"][data-position="inner"][data-swipe-direction="right"] {
  --closed-transform: translate3d(calc(var(--translate-x) + 2rem), 0, 0);
}

[data-slot="drawer-popup"][data-variant="aside"][data-position="inner"][data-swipe-direction="left"] {
  --closed-transform: translate3d(calc(var(--translate-x) - 2rem), 0, 0);
}

/*
 * Nested \`overlay\`: covers the top or bottom of its parent's column
 * (confirmation, toast) with the parent's width, offsets and corners. Never
 * pushes or scales the parent.
 */
[data-slot="drawer-popup"][data-variant="overlay"] {
  --drawer-content-height: auto;
  --drawer-content-max-height: calc(
    100dvh - var(--drawer-offset-top) - var(--drawer-offset-bottom) - 4rem
  );
  height: auto;
  max-height: var(--drawer-content-max-height);
  --translate-y: var(--drawer-swipe-movement-y, 0px);
}

[data-slot="drawer-popup"][data-variant="overlay"][data-position="bottom"] {
  top: auto;
  bottom: var(--drawer-push-bottom, 0px);
  transform-origin: bottom center;
  --closed-transform: translate3d(
    var(--translate-x),
    calc(100% + var(--drawer-offset-bottom) + var(--drawer-push-bottom, 0px) + 2px),
    0
  );
}

[data-slot="drawer-popup"][data-variant="overlay"][data-position="top"] {
  /* The parent's top edge (set when the parent doesn't start at the viewport top). */
  top: var(--drawer-overlay-top, 0px);
  bottom: auto;
  transform-origin: top center;
  --closed-transform: translate3d(
    var(--translate-x),
    calc(-100% - var(--drawer-offset-top) - var(--drawer-overlay-top, 0px) - 2px),
    0
  );
}

/* When any edge offset > 0, round all corners for a floating sheet (shadcn look). */
[data-slot="drawer-popup"][data-has-offset][data-swipe-direction="down"],
[data-slot="drawer-popup"][data-has-offset][data-swipe-direction="up"],
[data-slot="drawer-popup"][data-has-offset][data-swipe-direction="left"],
[data-slot="drawer-popup"][data-has-offset][data-swipe-direction="right"] {
  border-radius: var(--drawer-radius);
  border: var(--p-border-width-025, 1px) solid var(--p-color-border, rgba(0, 0, 0, 0.08));
}

[data-slot="drawer-popup"][data-starting-style],
[data-slot="drawer-popup"][data-ending-style] {
  transform: var(--closed-transform);
  opacity: 0.9999;
}

[data-slot="drawer-popup"][data-variant="aside"][data-position="inner"][data-starting-style],
[data-slot="drawer-popup"][data-variant="aside"][data-position="inner"][data-ending-style] {
  opacity: 0;
}

[data-slot="drawer-popup"][data-ending-style] {
  transition-duration: calc(var(--drawer-swipe-strength, 1) * 400ms);
}

[data-slot="drawer-popup"][data-swiping],
[data-slot="drawer-popup"][data-nested-drawer-swiping] {
  transition-duration: 0ms;
}

[data-slot="drawer-popup"][data-ending-style][data-swiping],
[data-slot="drawer-popup"][data-ending-style][data-nested-drawer-swiping] {
  transition-duration: calc(var(--drawer-swipe-strength, 1) * 400ms);
}

[data-slot="drawer-popup"][data-swipe-direction="down"][data-nested-drawer-open] {
  box-shadow:
    0 -20px 25px -5px rgb(0 0 0 / 0.1),
    0 -8px 10px -6px rgb(0 0 0 / 0.1);
}

[data-slot="drawer-content"] {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  /* One scroller for the panel: header / footer stick, the pre-footer may. */
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: inherit;
  /* Full-panel swipe: the drag can start anywhere on the surface. */
  touch-action: inherit;
  user-select: text;
  -webkit-user-select: text;
  transition: opacity 300ms cubic-bezier(0.45, 1.005, 0, 1.005);
}

[data-slot="drawer-popup"][data-nested-drawer-open] > [data-slot="drawer-content"] {
  opacity: 0;
}

[data-slot="drawer-popup"][data-nested-drawer-open][data-nested-drawer-swiping]
  > [data-slot="drawer-content"] {
  opacity: 1;
}

[data-slot="drawer-popup"][data-swiping] > [data-slot="drawer-content"] {
  user-select: none;
  -webkit-user-select: none;
}

[data-slot="drawer-swipe-handle"] {
  position: relative;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  cursor: grab;
  transition: opacity 200ms ease;
}

[data-slot="drawer-swipe-handle"]::after {
  content: "";
  display: block;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--p-color-border, rgba(0, 0, 0, 0.2));
}

[data-slot="drawer-popup"][data-swipe-axis="y"] > [data-slot="drawer-swipe-handle"] {
  width: 100%;
  height: 12px;
  justify-content: center;
}

[data-slot="drawer-popup"][data-swipe-axis="y"] > [data-slot="drawer-swipe-handle"]::after {
  width: 96px;
  height: 4px;
}

[data-slot="drawer-popup"][data-swipe-axis="x"] > [data-slot="drawer-swipe-handle"] {
  height: 100%;
  width: 12px;
  align-items: center;
}

[data-slot="drawer-popup"][data-swipe-axis="x"] > [data-slot="drawer-swipe-handle"]::after {
  width: 4px;
  height: 96px;
}

[data-slot="drawer-popup"][data-swipe-direction="down"] > [data-slot="drawer-swipe-handle"] {
  align-items: flex-end;
}

[data-slot="drawer-popup"][data-swipe-direction="up"] > [data-slot="drawer-swipe-handle"] {
  order: 1;
  align-items: flex-start;
}

[data-slot="drawer-popup"][data-swipe-direction="left"] > [data-slot="drawer-swipe-handle"] {
  order: 1;
  justify-content: flex-start;
}

[data-slot="drawer-popup"][data-swipe-direction="right"] > [data-slot="drawer-swipe-handle"] {
  justify-content: flex-end;
}

[data-slot="drawer-popup"][data-nested-drawer-open] > [data-slot="drawer-swipe-handle"] {
  opacity: 0;
}

[data-slot="drawer-popup"][data-nested-drawer-open][data-nested-drawer-swiping]
  > [data-slot="drawer-swipe-handle"] {
  opacity: 1;
}

[data-slot="drawer-swipe-handle"]:active {
  cursor: grabbing;
}

[data-slot="drawer-header"] {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  background: var(--drawer-surface);
  /* [title + description · actions + close], in the flow. */
  flex-direction: row;
  align-items: flex-start;
  gap: var(--p-space-200, 8px);
  padding: var(--p-space-400, 16px);
  padding-block-end: 0;
  text-align: start;
  /* Keep swipe-to-dismiss working from the header (don't start text selection). */
  touch-action: inherit;
  user-select: none;
  -webkit-user-select: none;
}

[data-slot="drawer-header-content"] {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

[data-slot="drawer-header-actions"] {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--p-space-100, 4px);
  /* Line the controls up with the title instead of the padding edge. */
  margin-block: calc(-1 * var(--p-space-100, 4px));
  margin-inline-end: calc(-1 * var(--p-space-100, 4px));
}

/*
 * Opt-in centered header on the mobile sheet (\`mobileAlign="center"\`). The
 * empty first column mirrors the end slot so the text stays truly centered.
 */
[data-slot="drawer-popup"][data-presentation="sheet"]
  [data-slot="drawer-header"][data-mobile-align="center"] {
  display: grid;
  grid-template-columns:
    minmax(var(--drawer-header-end-width, 0px), 1fr)
    auto
    minmax(max-content, 1fr);
  text-align: center;
}

[data-slot="drawer-popup"][data-presentation="sheet"]
  [data-slot="drawer-header"][data-mobile-align="center"]
  > [data-slot="drawer-header-content"] {
  grid-column: 2;
}

[data-slot="drawer-popup"][data-presentation="sheet"]
  [data-slot="drawer-header"][data-mobile-align="center"]
  > [data-slot="drawer-header-actions"] {
  grid-column: 3;
  justify-self: end;
}

/* Actions sit in a row at the end (Cancel · Save), wrapping when tight. */
[data-slot="drawer-footer"] {
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--p-space-200, 8px);
  margin-block-start: auto;
  padding: var(--p-space-400, 16px);
  padding-block-start: 0;
  position: sticky;
  bottom: 0;
  z-index: 1;
  background: var(--drawer-surface);
}

/* Above the footer; scrolls with the content unless \`sticky\`. */
[data-slot="drawer-pre-footer"] {
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: var(--p-space-200, 8px);
  margin-block-start: auto;
  padding: var(--p-space-400, 16px);
  padding-block-start: 0;
  background: var(--drawer-surface);
}

[data-slot="drawer-pre-footer"] + [data-slot="drawer-footer"] {
  margin-block-start: 0;
}

[data-slot="drawer-pre-footer"][data-sticky] {
  position: sticky;
  bottom: var(--drawer-footer-height, 0px);
  z-index: 1;
}

/* Separators: \`divider\` draws a border, \`shadow\` fades scrolled content into the surface. */
[data-slot="drawer-header"][data-separator="divider"] {
  padding-block-end: var(--p-space-400, 16px);
  border-block-end: var(--p-border-width-025, 1px) solid var(--p-color-border, rgba(0, 0, 0, 0.08));
}

[data-slot="drawer-footer"][data-separator="divider"],
[data-slot="drawer-pre-footer"][data-separator="divider"] {
  padding-block-start: var(--p-space-400, 16px);
  border-block-start: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
}

[data-slot="drawer-header"][data-separator="shadow"]::after,
[data-slot="drawer-footer"][data-separator="shadow"]::before,
[data-slot="drawer-pre-footer"][data-sticky][data-separator="shadow"]::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  height: var(--p-space-600, 24px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
}

[data-slot="drawer-header"][data-separator="shadow"]::after {
  top: 100%;
  background: linear-gradient(to bottom, var(--drawer-surface), transparent);
}

[data-slot="drawer-footer"][data-separator="shadow"]::before,
[data-slot="drawer-pre-footer"][data-sticky][data-separator="shadow"]::before {
  bottom: 100%;
  background: linear-gradient(to top, var(--drawer-surface), transparent);
}

[data-slot="drawer-content"][data-overflow-top]
  [data-slot="drawer-header"][data-separator="shadow"]::after,
[data-slot="drawer-content"][data-overflow-bottom]
  [data-slot="drawer-footer"][data-separator="shadow"]::before,
[data-slot="drawer-content"][data-overflow-bottom]
  [data-slot="drawer-pre-footer"][data-sticky][data-separator="shadow"]::before {
  opacity: 1;
}

[data-slot="drawer-title"] {
  margin: 0;
  font-size: var(--p-font-size-350, 0.875rem);
  font-weight: var(--p-font-weight-semibold, 600);
  line-height: var(--p-font-line-height-500, 1.25);
  color: var(--p-color-text, #303030);
}

[data-slot="drawer-description"] {
  margin: 0;
  font-size: var(--p-font-size-325, 0.8125rem);
  line-height: var(--p-font-line-height-500, 1.25);
  color: var(--p-color-text-secondary, #616161);
  text-wrap: balance;
}

[data-slot="drawer-body"] {
  touch-action: pan-y;
  /* Fills short panels; long content scrolls the whole panel under the sticky edges. */
  flex: 1 0 auto;
  padding: var(--p-space-400, 16px);
}
`;
