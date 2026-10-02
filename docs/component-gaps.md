# Gap decisions: missing components and absent props

Recorded from #5, which migrated a production Shopify admin app (339 files) off
`@shopify/polaris` v12 onto corex-ui and needed ~3,300 lines of local glue to do it.
This file is the decision record for that glue: what the library takes on, what it
declines, and what a consuming app should write instead.

Status values:

- **Shipped** — exported from the package; no local shim needed.
- **Won't implement** — deliberately out of scope, with the replacement named.

## Missing components (section B)

### Layout and primitives

| Component         | Decision | Built on                                                          |
| ----------------- | -------- | ----------------------------------------------------------------- |
| `Layout`          | Shipped  | `Grid` / `Grid.Item`, stacking below `md`.                        |
| `InlineGrid`      | Shipped  | `Grid`, with v12's count / track-list / responsive column shapes. |
| `FormLayout`      | Shipped  | `BlockStack`, with `FormLayout.Group` using `InlineGrid` for equal columns, responsive stacking, title, and helpText. |

| `TextContainer`   | Shipped  | `BlockStack` at v12's tight / loose rhythm.                       |
| `List`            | Shipped  | `s-unordered-list` / `s-ordered-list` / `s-list-item`.            |
| `DescriptionList` | Shipped  | `Grid` of term/description pairs.                                 |
| `InlineCode`      | Shipped  | `Text` on a monospace surface.                                    |
| `InlineError`     | Shipped  | `Text tone="critical"`, tied to the field by `fieldID`.           |
| `Tag`             | Shipped  | `s-chip`, removable through `onRemove`.                           |

### Data display

| Component               | Decision | Notes                                                                                                                                                                                                                                 |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IndexTable`            | Shipped  | On `Table`. Rows, cells, row click, selection with a header checkbox, bulk actions, pagination. v12's shift-click range selection and sticky header are not reproduced, and promoted bulk actions render in the same row as the rest. |
| `useIndexResourceState` | Shipped  | Owns the selection and returns v12's shape, so existing call sites drive the table unchanged.                                                                                                                                         |
| `DataTable`             | Shipped  | On `Table`, with numeric columns right-aligned. No sorting, totals or footer rows — use `IndexTable` when the list is interactive.                                                                                                    |
| `ResourceList`          | Shipped  | `BlockStack` + `renderItem`. No selection, sorting or bulk actions; `IndexTable` is the component for those.                                                                                                                          |
| `ResourceItem`          | Shipped  | `Clickable`, or a `Link` when given a `url`.                                                                                                                                                                                          |
| `Pagination`            | Shipped  | Previous/next buttons. v12's keyboard shortcuts are not reproduced; `Table`'s own `paginate` is the alternative inside a table.                                                                                                       |

### Filtering

| Component                | Decision | Notes                                                                                                                                                                                               |
| ------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IndexFilters`           | Shipped  | Tabs, search field, one popover per filter, applied-filter pills with individual removes, clear-all and the sort menu. v12's saved views and the mode state machine behind them are not reproduced. |
| `IndexFiltersMode`       | Shipped  | The enum, so call sites that pass `mode` still compile.                                                                                                                                             |
| `useSetIndexFiltersMode` | Shipped  | Holds the mode; nothing reads it, and that is deliberate.                                                                                                                                           |

### Overlay and feedback

| Component      | Decision        | Notes                                                                                                                                                                                   |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ActionList`   | Shipped         | `Clickable` rows with icon, help text and destructive tone, for use inside `Popover`.                                                                                                   |
| `Toast`        | Shipped         | Raises App Bridge's toast through `useToast` and renders nothing, so call sites keep mounting it conditionally.                                                                         |
| `SkeletonPage` | Shipped         | `Skeleton` in a page-shaped arrangement.                                                                                                                                                |
| `Frame`        | Won't implement | v12's app chrome. In an embedded app the admin and `s-page` own the frame; a `Frame` here would be a `Fragment` pretending to be a component. Delete the wrapper and keep its children. |
| `Sheet`        | Won't implement | There is no `s-sheet`, and a hand-built drawer would not match the admin's own overlays, focus trapping or mobile behaviour. Use `Modal`, which is the native overlay.                  |

### Form controls

| Component       | Decision | Notes                                                                                                            |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `RadioButton`   | Shipped  | A single-choice `s-choice-list`, so one radio or a set both behave natively.                                     |
| `Listbox`       | Shipped  | Option rows with `Section`, `Header`, `Action` and `Loading`, selected on pointer-down so the field keeps focus. |
| `Combobox`      | Shipped  | A field with the listbox beneath it.                                                                             |
| `Autocomplete`  | Shipped  | Options in, selection out, single or multiple.                                                                   |
| `AutoSelection` | Shipped  | The enum. Only `None` is honoured; the others warn in development.                                               |

Arrow-key navigation inside `Listbox` is the one piece of v12 behaviour knowingly
left out — the options are real controls, so tab and enter work.

### Hooks

| Hook             | Decision | Notes                                                                                                                                         |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `useBreakpoints` | Shipped  | `matchMedia` against Polaris's breakpoints. Reports nothing until after mount, rather than guessing a width and risking a hydration mismatch. |

### Already exported, but still shimmed

`DatePicker` and `DropZone` were in the package yet still wrapped locally. Both were
API gaps rather than missing components:

- `DatePicker` in 2.x is a date **field** with its own popover and presets, where v12's
  was a bare month grid driven by `month`/`year`/`onMonthChange`. The grid is
  `DatePickerCalendar`, which takes ISO strings instead of `Date`s. Documented rather
  than changed: they are two components for two jobs.
- `DropZone` reports through `onChange` with a DOM event, where v12 called
  `onDrop(files, accepted, rejected)`. `onDrop` is now accepted directly and called with
  the dropped files, so that shim can go.

## Absent props (section C)

| Gap                                 | Decision                                                                                                                                                                                                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button` has no `size`              | Won't implement. `s-button` has one height and the library ships no stylesheet to override it. v12's `micro`/`slim`/`medium`/`large` are accepted and ignored, with a development warning, so migrating code compiles. For dense rows, `variant="tertiary"` is the quiet control. |
| `Button` tone `success` / `magic`   | Mapped. Both fall back to `auto` with a development warning: `s-button` tone is `auto`/`critical`/`neutral`, and a filled green button is not a thing the admin draws.                                                                                                            |
| `Badge` tone `attention` / `magic`  | Mapped. `attention` is a caution by another name; `magic` marked AI features and reads closest to `info`.                                                                                                                                                                         |
| `Popover` has no controlled mode    | Implemented. `s-popover` exposes `showOverlay()` / `hideOverlay()`, so `active` and `onClose` now drive it, which a popover that must stay open during an in-flight save needs.                                                                                                   |
| `Avatar` has no `customer` variant  | Accepted and ignored, with a development warning. `s-avatar` renders initials or a generic person; v12's `customer` only changed the placeholder glyph.                                                                                                                           |
| `BlockStack` / `InlineStack` `fill` | Implemented as `fill`, setting the stack to fill its container's inline axis — what the call sites used it for.                                                                                                                                                                   |
