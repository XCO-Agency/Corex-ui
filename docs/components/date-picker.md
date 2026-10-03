# DatePicker

Controlled-form-input and calendar component wrapping Shopify Polaris's native `<s-date-picker>` custom element with support for dual-month view (`visibleMonths="2"`), date ranges, presets, and popover trigger modes.

```tsx
import { DatePicker, SDatePicker } from "@xco-agency/corex-ui";

// Popover dual-month range picker with presets sidebar (default presets={true})
<DatePicker
  type="range"
  name="reporting-period"
  visibleMonths="2"
  view="2025-05"
  value="2025-05-20--2025-06-10"
  onApply={(range) => setRange(range)}
/>

// Inline mode with presets sidebar
<DatePicker
  inline
  type="range"
  visibleMonths="2"
  selected={{ start: "2025-05-20", end: "2025-06-10" }}
  onApply={(range) => setRange(range)}
/>

// Without presets sidebar (calendar and inputs only)
<DatePicker
  presets={false}
  type="range"
  visibleMonths="2"
  selected={{ start: "2025-05-20", end: "2025-06-10" }}
/>

// Raw standalone web component without wrapper panel
<SDatePicker
  type="range"
  visibleMonths="2"
  view="2025-05"
  defaultValue="2025-05-20--2025-06-10"
/>
```

## Modern Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `type` | `"single" \| "range" \| "multiple"` | Selection mode for the calendar (default: `"range"` for ranges). |
| `name` | `string` | Form field name for form association. |
| `visibleMonths` | `"auto" \| "1" \| "2" \| 1 \| 2` | Number of months displayed simultaneously. Use `"2"` for side-by-side dual-month view. |
| `view` | `string` | Currently displayed month in `YYYY-MM` format (e.g. `"2025-05"`). |
| `defaultView` | `string` | Initial displayed month in `YYYY-MM` format when uncontrolled. |
| `value` | `string` | Selected value string (`YYYY-MM-DD` for single or `YYYY-MM-DD--YYYY-MM-DD` for range). |
| `defaultValue` | `string \| DateRangeType` | Default value when uncontrolled. |
| `selected` | `DatePickerValueType` | Controlled date, Date object, or date range object `{ start, end }`. |
| `presets` | `boolean \| DatePresetItemType[]` | Enables the left presets menu (Today, Yesterday, Last 7 days, Custom range, etc.). |
| `inline` | `boolean` | Renders the date picker panel inline rather than inside a popover. |
| `allow` | `string` | Selectable date range constraint (e.g. `2025-01-01--2025-12-31` or `--2026-10-02`). |
| `disallow` | `string` | Unselectable dates or ranges. |
| `allowDays` | `string` | Comma-separated list of selectable days of the week (`"monday, tuesday"`). |
| `disallowDays` | `string` | Comma-separated list of unselectable days of the week. |
| `minDate` | `string` | Earliest selectable ISO date string. |
| `maxDate` | `string` | Latest selectable ISO date string. |
| `onChange` | `(value: string \| DateRangeType) => void` | Callback fired when the selection changes. |
| `onApply` | `(range: DateRangeType, meta?: { presetId?: string }) => void` | Callback fired when user applies the selected range. |
| `onCancel` | `() => void` | Callback fired when user cancels selection. |
| `onViewChange` | `(view: string) => void` | Callback fired when user navigates to another month. |
| `children` | `(formattedRange: string, id: string) => ReactNode` | Custom popover activator render function. |
