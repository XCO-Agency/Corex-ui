/**
 * Injected once per document. Light theme only. Everything is scoped by
 * data-slot and themed through --cal-* custom variables that default to
 * Polaris tokens, so a host can restyle by overriding them on the calendar.
 */
export const CALENDAR_STYLE_ID = "cx-calendar-styles";

export const CALENDAR_CSS = `
[data-slot="calendar"],
[data-slot="calendar-modal-list"],
[data-slot="calendar-drag-ghost"] {
  --cal-bg: var(--p-color-bg-surface, #ffffff);
  --cal-bg-muted: var(--p-color-bg-surface-secondary, #f7f7f7);
  --cal-hover: var(--p-color-bg-surface-hover, #f1f1f1);
  --cal-border: var(--p-color-border-secondary, #e3e3e3);
  --cal-border-strong: var(--p-color-border, #cfcfcf);
  --cal-text: var(--p-color-text, #303030);
  --cal-muted: var(--p-color-text-secondary, #616161);
  --cal-accent: var(--p-color-bg-fill-brand, #303030);
  --cal-accent-text: var(--p-color-text-brand-on-bg-fill, #ffffff);
  --cal-today-bg: var(--p-color-bg-surface-info, #eaf4ff);
  --cal-event-bg: var(--p-color-bg-fill-info, #2b6fd6);
  --cal-event-fg: var(--p-color-text-info-on-bg-fill, #ffffff);
  --cal-now: var(--p-color-bg-fill-critical, #e22c3a);
  --cal-selection: color-mix(in srgb, var(--cal-event-bg) 20%, transparent);
  --cal-radius: var(--p-border-radius-300, 12px);
  --cal-gutter: 56px;
  color: var(--cal-text);
  font-family: var(--p-font-family-sans, inherit);
  font-size: var(--p-font-size-325, 0.8125rem);
  font-weight: var(--p-font-weight-regular, 450);
  font-style: normal;
  line-height: var(--p-font-line-height-500, 1.4);
  letter-spacing: normal;
  text-align: start;
  text-transform: none;
  text-indent: 0;
  white-space: normal;
  word-spacing: normal;
  color-scheme: light;
}

/*
 * Isolation: neutralize host element rules (button, h2, div, section, ...)
 * inside the calendar. The reset has attribute specificity, so it beats bare
 * element selectors from the host; the calendar's own [data-slot] rules come
 * later with the same specificity and win.
 */
[data-slot="calendar"] :where(div, span, section, h2, h3, button),
[data-slot="calendar-modal-list"] :where(div, span) {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: none;
  box-shadow: none;
  font: inherit;
  color: inherit;
  letter-spacing: inherit;
  text-transform: none;
  text-decoration: none;
  float: none;
  min-width: 0;
  max-width: none;
  transform: none;
  filter: none;
  opacity: 1;
}
[data-slot="calendar"] :where(button) { appearance: none; -webkit-appearance: none; cursor: pointer; }

[data-slot="calendar"] {
  container-type: inline-size;
  container-name: cx-cal;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  background: var(--cal-bg);
  border: var(--p-border-width-025, 1px) solid var(--cal-border);
  border-radius: var(--cal-radius);
  --cx-cal-dir: 1;
}
[data-slot="calendar"][dir="rtl"] { --cx-cal-dir: -1; }
[data-slot="calendar"] *,
[data-slot="calendar"] *::before,
[data-slot="calendar"] *::after,
[data-slot="calendar-modal-list"] * { box-sizing: border-box; }

[data-slot="calendar-sr"] {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

[data-slot="calendar-view"] {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
}
[data-slot="calendar-view"][data-anim="next"] { animation: cx-cal-slide 200ms ease-out; --cx-cal-from: calc(8% * var(--cx-cal-dir)); }
[data-slot="calendar-view"][data-anim="prev"] { animation: cx-cal-slide 200ms ease-out; --cx-cal-from: calc(-8% * var(--cx-cal-dir)); }
[data-slot="calendar-view"][data-anim="view"] { animation: cx-cal-view 200ms ease-out; }
[data-slot="calendar"][aria-busy="true"] [data-slot="calendar-view"] { opacity: 0.6; transition: opacity 150ms; }

/* Toolbar */
[data-slot="calendar-toolbar"] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--p-space-200, 8px);
  padding: var(--p-space-300, 12px);
  border-block-end: var(--p-border-width-025, 1px) solid var(--cal-border);
}
[data-slot="calendar-toolbar-section"] {
  display: flex;
  align-items: center;
  gap: var(--p-space-200, 8px);
  min-width: 0;
}
[data-slot="calendar-toolbar-section"][data-section="center"] { flex: 1 1 auto; justify-content: center; }
[data-slot="calendar-toolbar-section"][data-section="end"] { justify-content: flex-end; }
[data-slot="calendar-button-group"],
[data-slot="calendar-views"] { display: inline-flex; align-items: center; gap: 0; }
[data-slot="calendar-views"] {
  gap: 2px;
  padding: 2px;
  border-radius: 2rem;
  background: var(--cal-bg-muted);
}
[data-slot="calendar-button-group"] { gap: var(--p-space-100, 4px); }
[data-slot="calendar-title"] { text-align: center; }

[data-slot="calendar"] :is(button, [role="button"], [role="gridcell"]):focus-visible {
  outline: 2px solid var(--cal-accent);
  outline-offset: -2px;
}

/* Month grid */
[data-slot="calendar-grid"] { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; }
[data-slot="calendar-weekdays"],
[data-slot="calendar-week"] { display: grid; grid-template-columns: auto minmax(0, 1fr); }
[data-slot="calendar-weekday-cells"],
[data-slot="calendar-week-cells"] { display: grid; grid-column: 2; grid-row: 1; min-width: 0; }
[data-slot="calendar-weekdays"] { border-block-end: var(--p-border-width-025, 1px) solid var(--cal-border); background: var(--cal-bg-muted); }
[data-slot="calendar-weekday"] {
  padding: var(--p-space-200, 8px) var(--p-space-100, 4px);
  text-align: center;
  font-weight: var(--p-font-weight-600, 600);
  color: var(--cal-muted);
}
[data-slot="calendar-weeknum-head"],
[data-slot="calendar-weeknum"] {
  grid-column: 1;
  width: 36px;
  padding: var(--p-space-200, 8px) var(--p-space-100, 4px);
  text-align: center;
  font-size: 11px;
  color: var(--cal-muted);
  border-inline-end: var(--p-border-width-025, 1px) solid var(--cal-border);
}
[data-slot="calendar-weeknum"] { grid-row: 1; background: var(--cal-bg-muted); }
[data-slot="calendar-weeks"] { display: grid; flex: 1 1 auto; min-height: 0; }
[data-slot="calendar-week"] { position: relative; overflow: hidden; min-height: 0; }

[data-slot="calendar-day"] {
  position: relative;
  min-width: 0;
  min-height: 0;
  padding: 0;
  border-inline-end: var(--p-border-width-025, 1px) solid var(--cal-border);
  border-block-end: var(--p-border-width-025, 1px) solid var(--cal-border);
  background: var(--cal-bg);
  cursor: pointer;
  transition: background-color 120ms;
}
[data-slot="calendar-day"]:last-child { border-inline-end: 0; }
[data-slot="calendar-day"]:hover { background: var(--cal-hover); }
[data-slot="calendar-day"][data-weekend] { background: color-mix(in srgb, var(--cal-bg-muted) 55%, var(--cal-bg)); }
[data-slot="calendar-day"][data-outside] { color: var(--cal-muted); background: var(--cal-bg-muted); }
[data-slot="calendar-day"][data-outside] [data-slot="calendar-day-number"] { opacity: 0.55; }
[data-slot="calendar-day"][data-today] { background: var(--cal-today-bg); }
[data-slot="calendar-day"][data-selected] { background: var(--cal-selection); animation: cx-cal-fade 150ms ease-out; }
[data-slot="calendar-day"][data-drop-target] { background: var(--cal-selection); box-shadow: inset 0 0 0 2px var(--cal-event-bg); }
[data-slot="calendar-day"][data-pulse] { animation: cx-cal-pulse 600ms ease-out 1; }
[data-slot="calendar-day-header"] {
  display: flex;
  justify-content: flex-end;
  height: var(--cx-cal-daynum-h, 30px);
  padding: 4px 6px 0;
}
[data-slot="calendar-day-number"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 4px;
  border-radius: 11px;
  font-variant-numeric: tabular-nums;
}
[data-slot="calendar-day"][data-today] [data-slot="calendar-day-number"] {
  background: var(--cal-accent);
  color: var(--cal-accent-text);
  font-weight: var(--p-font-weight-600, 600);
}
[data-slot="calendar-pips"] { display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; padding: 2px 4px; }

[data-slot="calendar-week-events"] {
  display: grid;
  grid-column: 2;
  grid-row: 1;
  grid-auto-rows: var(--cx-cal-lane-h, 22px);
  align-content: start;
  min-width: 0;
  padding-block-start: var(--cx-cal-daynum-h, 30px);
  pointer-events: none;
  position: relative;
  z-index: 1;
}
[data-slot="calendar-week-events"] > * { pointer-events: auto; }
[data-slot="calendar-tg-allday"] [data-slot="calendar-week-events"] { padding-block: 2px; grid-column: auto; grid-row: auto; }
[data-slot="calendar-more"] {
  cursor: pointer;
  justify-self: start;
  align-self: center;
  margin-inline: 4px;
  padding: 0 6px;
  height: calc(var(--cx-cal-lane-h, 22px) - 4px);
  border-radius: 4px;
  font-size: 12px;
  font-weight: var(--p-font-weight-600, 600);
  color: var(--cal-muted);
}
[data-slot="calendar-more"]:hover { background: var(--cal-hover); color: var(--cal-text); }
[data-slot="calendar-more"]:active { transform: scale(0.98); }

/* Latin titles keep their own direction inside an RTL calendar (and vice versa). */
[data-slot="calendar-event-title"],
[data-slot="calendar-event-time"],
[data-slot="calendar-more"] { unicode-bidi: plaintext; }

/* Events */
[data-slot="calendar-event"] {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  height: calc(var(--cx-cal-lane-h, 22px) - 2px);
  margin: 1px 2px;
  padding: 0 6px;
  overflow: hidden;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  --cx-cal-ev-color: var(--cal-event-bg);
  transition: transform 100ms ease-out, background-color 120ms, opacity 120ms;
  animation: cx-cal-event-in 200ms ease-out backwards;
  animation-delay: calc(var(--cx-cal-i, 0) * 10ms);
}
[data-slot="calendar-event"][data-editable] { touch-action: none; cursor: grab; }
[data-slot="calendar-event"]:active:not([data-ghost]) { transform: scale(0.98); }
[data-slot="calendar-event"]:hover:not([data-ghost]) { z-index: 2; }
[data-slot="calendar-event"][data-variant="bar"],
[data-slot="calendar-event"][data-variant="block"] {
  background: var(--cx-cal-ev-color);
  color: var(--cx-cal-ev-fg, var(--cal-event-fg));
}
[data-slot="calendar-event"][data-variant="bar"]:hover,
[data-slot="calendar-event"][data-variant="block"]:hover {
  background: color-mix(in srgb, var(--cx-cal-ev-color) 82%, transparent);
}
[data-slot="calendar-event"][data-variant="bar"][data-continues-before] {
  margin-inline-start: 0;
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}
[data-slot="calendar-event"][data-variant="bar"][data-continues-after] {
  margin-inline-end: 0;
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}
[data-slot="calendar-event"][data-variant="dot"] { color: var(--cx-cal-ev-fg, var(--cal-text)); }
[data-slot="calendar-event"][data-variant="dot"]:hover,
[data-slot="calendar-event"][data-variant="list"]:hover {
  background: color-mix(in srgb, var(--cx-cal-ev-color) 12%, transparent);
}
[data-slot="calendar-event-dot"] {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cx-cal-ev-color);
}
[data-slot="calendar-event-time"] { flex: none; font-variant-numeric: tabular-nums; opacity: 0.85; }
[data-slot="calendar-event-title"] { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: var(--p-font-weight-550, 550); }
[data-slot="calendar-event"][data-variant="pip"] {
  width: 8px;
  height: 8px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: var(--cx-cal-ev-color);
}
[data-slot="calendar-event"][data-variant="block"] {
  position: absolute;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0;
  margin: 0;
  padding: 2px 6px;
  z-index: 1;
  border-radius: 6px;
}
[data-slot="calendar-event"][data-variant="block"][data-continues-before] { border-start-start-radius: 0; border-start-end-radius: 0; }
[data-slot="calendar-event"][data-variant="block"][data-continues-after] { border-end-start-radius: 0; border-end-end-radius: 0; }
[data-slot="calendar-event"][data-variant="block"] [data-slot="calendar-event-time"] { font-size: 11px; }
[data-slot="calendar-event"][data-variant="block"][data-short] { flex-direction: row; align-items: center; gap: 4px; padding-block: 0; }
[data-slot="calendar-event"][data-variant="list"] {
  height: auto;
  margin: 0;
  padding: var(--p-space-300, 12px) var(--p-space-400, 16px);
  gap: var(--p-space-300, 12px);
  border-radius: 0;
  font-size: inherit;
}
[data-slot="calendar-event"][data-variant="list"] [data-slot="calendar-event-time"] { min-width: 9rem; color: var(--cal-muted); }
[data-slot="calendar-event"][data-dragging] { opacity: 0.4; }
[data-slot="calendar-event"][data-ghost] {
  opacity: 0.6;
  pointer-events: none;
  z-index: 5;
  animation: none;
  transition: none;
}
[data-slot="calendar-event"][data-settling] { animation: cx-cal-settle 380ms cubic-bezier(0.34, 1.56, 0.64, 1); }
/*
 * Resize handles: a generous hit area (up to 12px, but never more than ~40% of
 * a short block so the block can still be dragged) with a visible grip on hover.
 */
[data-slot="calendar-resize"] { position: absolute; z-index: 3; touch-action: none; display: flex; align-items: center; justify-content: center; }
[data-slot="calendar-resize"][data-edge="end"] { inset-block: 0; inset-inline-end: 0; width: 12px; cursor: ew-resize; }
[data-slot="calendar-resize"][data-edge="bottom"] { inset-inline: 0; bottom: 0; height: clamp(6px, 40%, 12px); cursor: ns-resize; }
[data-slot="calendar-resize"]::after {
  content: "";
  border-radius: 2px;
  background: currentColor;
  opacity: 0;
  transition: opacity 120ms;
}
[data-slot="calendar-resize"][data-edge="end"]::after { width: 3px; height: 60%; max-height: 12px; }
[data-slot="calendar-resize"][data-edge="bottom"]::after { width: 20px; height: 3px; }
[data-slot="calendar-event"]:hover > [data-slot="calendar-resize"]::after { opacity: 0.6; }
[data-slot="calendar-resize"]:hover::after { opacity: 1; }
html[data-cx-calendar-dragging] { cursor: grabbing; user-select: none; -webkit-user-select: none; }
[data-slot="calendar-drag-ghost"] {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 700;
  max-width: 220px;
  padding: 4px 10px;
  overflow: hidden;
  border-radius: 6px;
  background: color-mix(in srgb, var(--cal-event-bg) 14%, var(--cal-bg));
  color: var(--cal-text);
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.85;
  pointer-events: none;
}

/* Time grid */
[data-slot="calendar-timegrid"] { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; }
[data-slot="calendar-tg-head"],
[data-slot="calendar-tg-allday"] {
  display: flex;
  padding-inline-end: var(--cx-cal-sb, 0px);
  border-block-end: var(--p-border-width-025, 1px) solid var(--cal-border);
}
[data-slot="calendar-tg-head"] { background: var(--cal-bg-muted); }
[data-slot="calendar-gutter"] {
  position: relative;
  flex: 0 0 var(--cal-gutter);
  width: var(--cal-gutter);
  padding: 4px 8px 0;
  text-align: end;
  font-size: 11px;
  color: var(--cal-muted);
}
[data-slot="calendar-tg-days"] { display: grid; flex: 1 1 auto; min-width: 0; }
[data-slot="calendar-tg-day"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--p-space-200, 8px) 0;
  border-inline-start: var(--p-border-width-025, 1px) solid var(--cal-border);
}
button[data-slot="calendar-tg-day"] { cursor: pointer; }
button[data-slot="calendar-tg-day"]:hover { background: var(--cal-hover); }
[data-slot="calendar-tg-weekday"] { color: var(--cal-muted); font-weight: var(--p-font-weight-600, 600); }
[data-slot="calendar-tg-date"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: 14px;
  font-size: var(--p-font-size-400, 1rem);
}
[data-slot="calendar-tg-date"][data-today] { background: var(--cal-accent); color: var(--cal-accent-text); }
[data-slot="calendar-tg-date"][data-pulse] { animation: cx-cal-pulse 600ms ease-out 1; }
[data-slot="calendar-allday-body"] { position: relative; flex: 1 1 auto; min-width: 0; min-height: 28px; }
[data-slot="calendar-allday-cells"] { position: absolute; inset: 0; display: grid; }
[data-slot="calendar-allday-cell"] { border-inline-start: var(--p-border-width-025, 1px) solid var(--cal-border); cursor: pointer; }
[data-slot="calendar-allday-cell"][data-today] { background: var(--cal-today-bg); }
[data-slot="calendar-allday-cell"][data-selected] { background: var(--cal-selection); animation: cx-cal-fade 150ms ease-out; }

[data-slot="calendar-tg-scroll"] {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  max-height: var(--cx-cal-scroll-max, none);
  overflow-y: auto;
  overscroll-behavior: contain;
}
[data-slot="calendar-tg-body"] { position: relative; display: flex; }
[data-slot="calendar-tg-body"] > [data-slot="calendar-gutter"] { padding: 0; }
[data-slot="calendar-hour"] { position: absolute; inset-inline-end: 8px; transform: translateY(-50%); white-space: nowrap; }
[data-slot="calendar-tg-cols"] {
  position: relative;
  display: grid;
  flex: 1 1 auto;
  min-width: 0;
  background-image:
    linear-gradient(to bottom, var(--cal-border) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--cal-border) 45%, transparent) 1px, transparent 1px);
  background-size: 100% var(--cx-cal-hour-h, 56px), 100% var(--cx-cal-slot-h, 28px);
  cursor: pointer;
}
[data-slot="calendar-tg-col"] { position: relative; border-inline-start: var(--p-border-width-025, 1px) solid var(--cal-border); }
[data-slot="calendar-tg-col"][data-today] { background: color-mix(in srgb, var(--cal-today-bg) 55%, transparent); }
[data-slot="calendar-closed"] { position: absolute; inset-inline: 0; background: color-mix(in srgb, var(--cal-bg-muted) 80%, transparent); pointer-events: none; }
[data-slot="calendar-selection"] { position: absolute; inset-inline: 0; background: var(--cal-selection); border-radius: 4px; pointer-events: none; animation: cx-cal-fade 150ms ease-out; z-index: 1; }
[data-slot="calendar-now"] { position: absolute; inset-inline: 0; height: 2px; margin-block-start: -1px; background: var(--cal-now); pointer-events: none; z-index: 3; }
[data-slot="calendar-now-dot"] { position: absolute; inset-inline-start: -5px; top: -4px; width: 10px; height: 10px; border-radius: 50%; background: var(--cal-now); }

/* List */
[data-slot="calendar-list"] { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
[data-slot="calendar-list-empty"] { padding: var(--p-space-800, 32px) var(--p-space-400, 16px); text-align: center; color: var(--cal-muted); }
[data-slot="calendar-list-day"] { content-visibility: auto; contain-intrinsic-size: auto 96px; border-block-end: var(--p-border-width-025, 1px) solid var(--cal-border); }
[data-slot="calendar-list-heading"] {
  margin: 0;
  padding: var(--p-space-200, 8px) var(--p-space-400, 16px);
  background: var(--cal-bg-muted);
  font-size: inherit;
  font-weight: var(--p-font-weight-650, 650);
}
[data-slot="calendar-list-heading"][data-today] { background: var(--cal-today-bg); }

/* Day events modal ("+N more") */
[data-slot="calendar-modal-list"] {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--cal-text);
  font-family: var(--p-font-family-sans, inherit);
  font-size: var(--p-font-size-325, 0.8125rem);
  line-height: 1.4;
}

/* Narrow screens */
@container cx-cal (max-width: 639px) {
  [data-slot="calendar-toolbar-section"][data-section="center"] { order: -1; flex-basis: 100%; }
  [data-slot="calendar-toolbar"] { justify-content: space-between; }
  [data-slot="calendar-weeknum"],
  [data-slot="calendar-weeknum-head"] { width: 24px; padding-inline: 0; }
  [data-slot="calendar-day"] { min-height: 52px; }
  [data-slot="calendar-event"][data-variant="list"] { flex-wrap: wrap; }
  [data-slot="calendar-event"][data-variant="list"] [data-slot="calendar-event-time"] { min-width: 0; }
  [data-slot="calendar"] { --cal-gutter: 44px; }
}

/* Density */
[data-slot="calendar"][data-density="compact"] [data-slot="calendar-toolbar"] { padding: var(--p-space-200, 8px); }
[data-slot="calendar"][data-density="compact"] [data-slot="calendar-event"] { font-size: 11px; }

/* Motion */
@keyframes cx-cal-slide { from { opacity: 0; transform: translateX(var(--cx-cal-from, 8%)); } to { opacity: 1; transform: none; } }
@keyframes cx-cal-view { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes cx-cal-event-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: none; } }
@keyframes cx-cal-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cx-cal-settle { 0% { transform: scale(1.06); } 100% { transform: scale(1); } }
@keyframes cx-cal-pulse {
  0% { box-shadow: inset 0 0 0 0 var(--cal-event-bg); }
  40% { box-shadow: inset 0 0 0 3px var(--cal-event-bg); }
  100% { box-shadow: inset 0 0 0 0 transparent; }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="calendar-view"][data-anim] { animation-name: cx-cal-fade; }
  [data-slot="calendar-event"] { animation-name: cx-cal-fade; transition: none; }
  [data-slot="calendar-event"][data-settling] { animation-name: cx-cal-fade; }
  [data-slot="calendar-event"]:active:not([data-ghost]) { transform: none; }
  [data-slot="calendar-day"][data-pulse],
  [data-slot="calendar-tg-date"][data-pulse] { animation: none; }
}
`;
