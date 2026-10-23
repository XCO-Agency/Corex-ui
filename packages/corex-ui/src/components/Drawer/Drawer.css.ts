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

[data-slot="drawer-popup"] {
  --drawer-offset-top: 8px;
  --drawer-offset-right: 8px;
  --drawer-offset-bottom: 8px;
  --drawer-offset-left: 8px;
  --drawer-content-height: var(--drawer-height, auto);
  --drawer-content-max-height: none;
  --drawer-content-width: auto;
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
  background: var(--p-color-bg-surface, #ffffff);
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
  touch-action: none;
  --drawer-content-max-height: calc(100dvh - 6rem);
}

[data-slot="drawer-popup"][data-swipe-axis="y"][data-snap-points] {
  --drawer-content-height: 100dvh;
}

/*
 * Side drawer (desktop default): stretch top→bottom with per-side offset so the
 * panel floats (shadcn: inset-y-0 + margin + 24px radius).
 * No swipe-handle chrome; swipe works on the full panel surface.
 */
[data-slot="drawer-popup"][data-swipe-axis="x"],
[data-slot="drawer-popup"][data-presentation="drawer"] {
  top: 0;
  bottom: 0;
  inset-block: 0;
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
  border-radius: var(--p-border-radius-400, 24px) var(--p-border-radius-400, 24px) 0 0;
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
  border-radius: 0 0 var(--p-border-radius-400, 24px) var(--p-border-radius-400, 24px);
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
  border-radius: 0 var(--p-border-radius-400, 24px) var(--p-border-radius-400, 24px) 0;
  border-inline-end: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
  --closed-transform: translate3d(
    calc(-100% - var(--drawer-offset-left) - 2px),
    0,
    0
  );
  --translate-x: calc(
    var(--drawer-swipe-movement-x, 0px) + var(--stack-peek-offset) +
      (var(--stack-shrink) * 100%)
  );
}

[data-slot="drawer-popup"][data-swipe-direction="right"] {
  right: 0;
  transform-origin: right center;
  border-radius: var(--p-border-radius-400, 24px) 0 0 var(--p-border-radius-400, 24px);
  border-inline-start: var(--p-border-width-025, 1px) solid
    var(--p-color-border, rgba(0, 0, 0, 0.08));
  --closed-transform: translate3d(
    calc(100% + var(--drawer-offset-right) + 2px),
    0,
    0
  );
  --translate-x: calc(
    var(--drawer-swipe-movement-x, 0px) - var(--stack-peek-offset) -
      (var(--stack-shrink) * 100%)
  );
}

/* When any edge offset > 0, round all corners for a floating sheet (shadcn look). */
[data-slot="drawer-popup"][data-has-offset][data-swipe-direction="down"],
[data-slot="drawer-popup"][data-has-offset][data-swipe-direction="up"],
[data-slot="drawer-popup"][data-has-offset][data-swipe-direction="left"],
[data-slot="drawer-popup"][data-has-offset][data-swipe-direction="right"] {
  border-radius: var(--p-border-radius-400, 24px);
  border: var(--p-border-width-025, 1px) solid var(--p-color-border, rgba(0, 0, 0, 0.08));
}

[data-slot="drawer-popup"][data-starting-style],
[data-slot="drawer-popup"][data-ending-style] {
  transform: var(--closed-transform);
  opacity: 0.9999;
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
  overflow: hidden;
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
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 2px;
  padding: var(--p-space-400, 16px);
  padding-block-end: 0;
  /* Keep swipe-to-dismiss working from the header (don't start text selection). */
  touch-action: inherit;
  user-select: none;
  -webkit-user-select: none;
}

/* Sheet (mobile): centered header. Side drawer (desktop): start-aligned. */
[data-slot="drawer-popup"][data-presentation="sheet"] [data-slot="drawer-header"] {
  text-align: center;
}

[data-slot="drawer-popup"][data-presentation="drawer"] [data-slot="drawer-header"] {
  text-align: start;
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
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--p-space-400, 16px);
}
`;
