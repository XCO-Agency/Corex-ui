# Calendar

Self-contained event calendar (FullCalendar-style) with month, week, day and list views. No extra dependencies: date math, recurrence, lane/overlap layout and drag-and-drop are built in. Styles are injected once per document (`#cx-calendar-styles`).

```tsx
import { Calendar } from "@xco-agency/corex-ui";

<Calendar
  events={[
    { id: "1", title: "Offsite", start: "2026-10-21", end: "2026-10-24", allDay: true },
    { id: "2", title: "Review", start: "2026-10-23T11:00:00", end: "2026-10-23T12:00:00" },
  ]}
  editable
  selectable
/>;
```

## Views

| View | Shows |
| :--- | :---- |
| `month` | 6×7 grid (or `fixedWeekCount={false}`), multi-day bars on stable lanes, timed events as dot rows, "+N more" modal. Under 640px: dots only, tap a day for its list. |
| `week` / `day` | All-day lanes + time grid. Overlapping events share the width; business hours shaded; now line; opens scrolled to now. |
| `list` | Events of the month grouped by day, with an empty state. |

## Interactions

- **Drag** an event to another day (month) or slot (week/day); **resize** from the bottom edge (time grid) or the end edge of all-day bars (month). A ghost previews the target, Esc cancels.
- `onEventDrop` / `onEventResize` are applied optimistically. Return `false` or reject to snap the event back. A new `events` prop replaces the optimistic state, so update your events in the handler.
- **Select** a range by dragging across days or slots (`selectable`); `onSelect` gets an exclusive `end`.
- Recurring events (`rrule`) are not draggable.

## Async events

```tsx
<Calendar events={(range) => fetchEvents(range.start, range.end)} />
```

The loader runs for each new visible range; stale responses are ignored and the calendar is `aria-busy` while loading.

## Accessibility

- Month view is a `role="grid"` with a roving tabindex. Arrows, `PageUp`/`PageDown` (`Shift` for a year), `Home`/`End`, `T` (today), `Enter`.
- Events are focusable buttons whose label includes title, time and date.
- Title changes are announced in a polite live region.
- "+N more" opens the day's events in a Corex `Modal`.

## Theming

Override the variables on the calendar (or an ancestor): `--cal-bg`, `--cal-bg-muted`, `--cal-hover`, `--cal-border`, `--cal-text`, `--cal-muted`, `--cal-accent`, `--cal-today-bg`, `--cal-event-bg`, `--cal-event-fg`, `--cal-now`, `--cal-selection`. They default to Polaris tokens. The calendar is light-only for now, and its elements are reset so host element rules (`button`, `h2`, `div`, …) don't leak in. `density="compact"`, `dir="rtl"` and `classNames` slots are also available. Animations respect `prefers-reduced-motion` (fades only).

Toolbar actions are Corex `Button`s, and "+N more" (or a tapped day on narrow screens) opens a Corex `Modal` with the day's events.

## Not supported (yet)

- `timeZone` — dates are interpreted in the browser's local time zone.
- Dragging all-day events within the week/day all-day row, and converting between timed and all-day by dragging.
- `EXDATE`, `BYMONTHDAY`, `BYSETPOS` and other advanced RRULE parts.

## Props

| Prop | Type | Description |
| :--- | :--- | :---------- |
| `events` | `CalendarEventType[] \| (range) => Promise<CalendarEventType[]>` | Array, or loader called per visible range. |
| `view` / `defaultView` / `onViewChange` | `"month" \| "week" \| "day" \| "list"` | Controlled or uncontrolled. Uncontrolled on phones defaults to `list`. |
| `date` / `defaultDate` / `onDatesChange` | `Date` / `({ start, end, view, date }) => void` | Visible date; `onDatesChange` fires on every range change. |
| `firstDay` | `0`–`6` | Week start. Default `0` (Sunday). |
| `locale` | `string` | `Intl` locale for titles, weekdays and times. |
| `weekends` / `weekNumbers` | `boolean` | Hide Sat/Sun; show ISO week numbers. |
| `dayMaxEvents` | `number \| boolean` | Month rows before "+N more". `true` fits the cell. Default `3`. |
| `fixedWeekCount` | `boolean` | Always 6 weeks. Default `true`. |
| `editable` / `selectable` | `boolean` | Drag/resize events; drag across days/slots to select. |
| `nowIndicator` | `boolean` | Red now line in week/day. Default `true`. |
| `slotMinTime` / `slotMaxTime` / `slotDuration` | `"HH:mm"` / `number` (minutes) | Time grid range and slot size (default 30). |
| `businessHours` | `boolean \| { daysOfWeek?, startTime?, endTime? }` | Shades non-business time. |
| `height` | `number \| "auto"` | Fixed px (views scroll inside) or content height. |
| `headerToolbar` | `false \| { start?, center?, end? }` | Tokens `prev,next today title month,week,day,list`. |
| `density` | `"comfortable" \| "compact"` | Row/slot sizing. |
| `dir` | `"ltr" \| "rtl" \| "auto"` | Mirrors the layout. |
| `onDateClick` | `({ date, allDay }) => void` | Day cell / time slot click. |
| `onEventClick` | `({ event, start, end, nativeEvent }) => void` | Event click / Enter. |
| `onSelect` | `({ start, end, allDay }) => void` | Range selection (end exclusive). |
| `onEventDrop` / `onEventResize` | `(info) => void \| boolean \| Promise` | Applied optimistically; return `false` or reject to revert. |
| `renderEvent` / `renderDayCell` | `(info) => ReactNode` | Custom event body / day number. |
| `classNames` | `{ root?, toolbar?, title?, grid?, dayCell?, event?, popover?, timeGrid? }` | Slot class overrides. |

## Event shape (`CalendarEventType`)

| Field | Type | Description |
| :---- | :--- | :---------- |
| `id`, `title` | `string` | Required. |
| `start` / `end?` | `Date \| string` | Date-only strings are local midnight. All-day `end` is **exclusive**. Default length: 1 day / 1 hour. |
| `allDay?` | `boolean` | All-day bar instead of a timed event. |
| `color?` / `textColor?` | `string` | Background / text color. |
| `editable?` | `boolean` | Overrides calendar `editable`. Recurring events are never draggable. |
| `rrule?` | `string` | `FREQ=DAILY\|WEEKLY\|MONTHLY\|YEARLY`, `INTERVAL`, `COUNT`, `UNTIL`, `BYDAY`. |
| `extendedProps?` | `Record<string, unknown>` | Free-form data. |

