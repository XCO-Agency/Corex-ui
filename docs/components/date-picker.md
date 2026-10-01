# DatePicker

Controlled-form-input pattern over `s-date-picker`.

```tsx
import { DatePicker } from "@xco-agency/corex-ui";

<DatePicker selected={date} onChange={(date) => setDate(date)} />;
```

## Prop mapping

| Legacy prop | Behavior                                                         |
| ----------- | ---------------------------------------------------------------- |
| `selected`  | An ISO date string (`"2026-01-01"`), set as a live DOM property. |
| `onChange`  | Bound to the native `change` event; called as `onChange(date)`.  |

## Scope limit

**Single-date selection only.** Legacy Polaris React's `DatePicker` also supports a range mode
(`allowRange`, `{start, end}` selection) — that isn't implemented in this pass. See
[component-coverage.md](../component-coverage.md).

## Not v12's `DatePicker`

v12's `DatePicker` was a bare month grid driven by `month` / `year` /
`onMonthChange`, with `selected` as a `{ start, end }` range of `Date`s. This is a
date **field** with its own popover and presets — a different component for a
different job. For the grid, use `DatePickerCalendar`, which takes ISO strings rather
than `Date`s and navigates itself, so the page no longer has to own the month.
