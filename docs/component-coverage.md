# Component coverage

An explicit audit of every Polaris web component against what `@xco-agency/corex-ui` currently wraps,
by category (per [shopify.dev's App Home Polaris web components reference](https://shopify.dev/docs/api/app-home/polaris-web-components)),
plus the separate App Bridge subsystem. Existing gaps are listed with a reason, not silently
omitted — if you need one of the "Not yet" rows, it's a good candidate to add next following
[architecture.md](./architecture.md#adding-a-new-component).

Components that exist in legacy Polaris React with no single web component behind them
— `IndexTable`, `IndexFilters`, `ActionList`, `ResourceList` and the rest — are recorded
in [component-gaps.md](./component-gaps.md), along with the two the library declines to
ship.

## Actions

| Web component      | Status                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `s-button`         | ✅ `Button`                                                                                               |
| `s-button-group`   | ✅ `ButtonGroup`                                                                                          |
| `s-link`           | ✅ `Link`                                                                                                 |
| `s-menu`           | ✅ `Menu`                                                                                                 |
| `s-clickable`      | ✅ `Clickable` / `ClickableAction`                                                                        |
| `s-clickable-chip` | Not yet — [`Tag`](./components/tag.md) covers the removable pill; a clickable chip has no v12 equivalent. |

## Feedback and status indicators

| Web component | Status                                                                         |
| ------------- | ------------------------------------------------------------------------------ |
| `s-badge`     | ✅ `Badge`                                                                     |
| `s-banner`    | ✅ `Banner`                                                                    |
| `s-spinner`   | ✅ `Spinner`                                                                   |
| — (extension) | ✅ `IconTile` — Stylized icon tile with `base` and `strong` color intensities. |

## Forms

| Web component                                                                          | Status                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `s-text-field`                                                                         | ✅ `TextField`                                                                                                                                                                               |
| `s-text-area`                                                                          | ✅ `TextField` (`multiline`)                                                                                                                                                                 |
| `s-select`                                                                             | ✅ `Select`                                                                                                                                                                                  |
| `s-checkbox`                                                                           | ✅ `Checkbox`                                                                                                                                                                                |
| `s-choice-list`                                                                        | ✅ `ChoiceList`                                                                                                                                                                              |
| `s-date-field`                                                                         | ✅ `DateField`                                                                                                                                                                               |
| `s-date-picker`                                                                        | ✅ `DatePicker` — **single-date only**, no range mode yet.                                                                                                                                   |
| `s-email-field`, `s-url-field`, `s-number-field`, `s-password-field`, `s-search-field` | Covered by `TextField`'s `type` prop (`type="email"` etc.) rather than separate components, matching how legacy Polaris React only ever had one `TextField`.                                 |
| `s-color-field`                                                                        | ✅ `ColorField`                                                                                                                                                                              |
| `s-color-picker`                                                                       | Not yet — the field covers the common case; the standalone picker is deferred pending real-world demand.                                                                                     |
| `s-money-field`                                                                        | ✅ `MoneyField`                                                                                                                                                                              |
| `s-switch`                                                                             | ✅ `Switch`                                                                                                                                                                                  |
| `s-drop-zone`                                                                          | ✅ [`DropZone`](./components/drop-zone.md) — v12's `onDrop` is accepted; `DropZone.FileUpload` has no equivalent, since the element draws its own placeholder.                               |
| — (no catalog equivalent)                                                              | ✅ `RangeSlider` — no `s-range-slider` exists; ported directly from legacy Polaris React's implementation instead. See [architecture.md](./architecture.md#4-self-contained-custom-control). |

## Layout and structure

| Web component                                       | Status                                                                                                                                                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `s-box`                                             | ✅ `Box`                                                                                                                                                                                                            |
| `s-stack`                                           | ✅ `BlockStack` / `InlineStack`                                                                                                                                                                                     |
| `s-section`                                         | ✅ `Card`                                                                                                                                                                                                           |
| `s-page`                                            | ✅ `Page`                                                                                                                                                                                                           |
| `s-divider`                                         | ✅ `Divider`                                                                                                                                                                                                        |
| `s-grid`, `s-grid-item`                             | ✅ `Grid` / `Grid.Item`, plus the v12 layouts built on them: [`Layout`](./components/layout.md) and [`InlineGrid`](./components/inline-grid.md).                                                                    |
| `s-query-container`                                 | ✅ `QueryContainer`                                                                                                                                                                                                 |
| `s-scroll-box`                                      | ✅ [`Scrollable`](./components/scrollable.md)                                                                                                                                                                       |
| `s-ordered-list`, `s-unordered-list`, `s-list-item` | ✅ [`List`](./components/list.md) / `List.Item`                                                                                                                                                                     |
| `s-table`                                           | ✅ `Table` (+ `HeaderRow`, `HeaderCell`, `Body`, `Row`, `Cell`) — see [table.md](./components/table.md). Legacy `DataTable`/`IndexTable`, with their own sorting/selection/pagination state, are still outstanding. |

## Media and visuals

| Web component | Status         |
| ------------- | -------------- |
| `s-avatar`    | ✅ `Avatar`    |
| `s-thumbnail` | ✅ `Thumbnail` |
| `s-icon`      | ✅ `Icon`      |
| `s-image`     | ✅ `Image`     |

## Overlays

| Web component | Status                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| `s-modal`     | ✅ `Modal`                                                                                                |
| `s-popover`   | ✅ [`Popover`](./components/popover.md) — invoker-driven, with an optional controlled `active`/`onClose`. |

## Typography and content

| Web component              | Status                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `s-text`                   | ✅ `Text`                                                                                              |
| `s-tooltip`                | ✅ `Tooltip`                                                                                           |
| `s-heading`, `s-paragraph` | Not yet — `Text`'s `variant` prop already covers heading/paragraph styling for legacy-parity purposes. |
| `s-chip`                   | ✅ [`Tag`](./components/tag.md) — a removable pill, which `Badge` is not.                              |

## App Bridge (separate subsystem — see [app-bridge.md](./app-bridge.md))

| Element / API                                                   | Status                                                                                                                   |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `s-app-window`                                                  | ✅ `AppWindow`                                                                                                           |
| `s-app-nav`                                                     | ✅ `AppNav`                                                                                                              |
| `ui-save-bar`                                                   | ✅ `SaveBar`                                                                                                             |
| `window.shopify.toast`                                          | ✅ `useToast()`                                                                                                          |
| `window.shopify.saveBar`                                        | ✅ `useSaveBar()`                                                                                                        |
| `data-save-bar` / `data-discard-confirmation` (form attributes) | Documented only (plain HTML attributes, no wrapper needed) — see [app-bridge.md](./app-bridge.md#forms-with-a-save-bar). |
