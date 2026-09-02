# Component coverage

An explicit audit of every Polaris web component against what `@xco/corex-ui` currently wraps,
by category (per [shopify.dev's App Home Polaris web components reference](https://shopify.dev/docs/api/app-home/polaris-web-components)),
plus the separate App Bridge subsystem. Existing gaps are listed with a reason, not silently
omitted — if you need one of the "Not yet" rows, it's a good candidate to add next following
[architecture.md](./architecture.md#adding-a-new-component).

## Actions

| Web component | Status |
| --- | --- |
| `s-button` | ✅ `Button` |
| `s-button-group` | ✅ `ButtonGroup` |
| `s-link` | ✅ `Link` |
| `s-menu` | ✅ `Menu` |
| `s-clickable` | Not yet — a generic interactive-element primitive; low legacy-parity value since Polaris React has no direct `Clickable` equivalent. |
| `s-clickable-chip` | Not yet — overlaps with `Badge`/`Link` for most use cases. |

## Feedback and status indicators

| Web component | Status |
| --- | --- |
| `s-badge` | ✅ `Badge` |
| `s-banner` | ✅ `Banner` |
| `s-spinner` | ✅ `Spinner` |

## Forms

| Web component | Status |
| --- | --- |
| `s-text-field` | ✅ `TextField` |
| `s-text-area` | ✅ `TextField` (`multiline`) |
| `s-select` | ✅ `Select` |
| `s-checkbox` | ✅ `Checkbox` |
| `s-choice-list` | ✅ `ChoiceList` |
| `s-date-field` | ✅ `DateField` |
| `s-date-picker` | ✅ `DatePicker` — **single-date only**, no range mode yet. |
| `s-email-field`, `s-url-field`, `s-number-field`, `s-password-field`, `s-search-field` | Covered by `TextField`'s `type` prop (`type="email"` etc.) rather than separate components, matching how legacy Polaris React only ever had one `TextField`. |
| `s-color-field`, `s-color-picker` | Not yet — color selection UI is more involved than a straight attribute mapping; deferred pending real-world demand. |
| `s-money-field` | Not yet — needs currency-formatting decisions best made against a real use case rather than guessed. |
| `s-switch` | Not yet — legacy Polaris React has no direct `Switch`; `Checkbox` already covers on/off toggles for parity purposes. |
| `s-drop-zone` | Not yet — file upload/drag-drop has meaningfully more surface area (progress, previews, validation) than the rest of this pass. |

## Layout and structure

| Web component | Status |
| --- | --- |
| `s-box` | ✅ `Box` |
| `s-stack` | ✅ `BlockStack` / `InlineStack` |
| `s-section` | ✅ `Card` |
| `s-page` | ✅ `Page` |
| `s-divider` | ✅ `Divider` |
| `s-grid`, `s-query-container` | Not yet — no direct legacy Polaris React equivalent; candidates for a future layout-focused pass. |
| `s-ordered-list`, `s-unordered-list` | Not yet — straightforward thin wrappers, just not included in this pass. |
| `s-table` | Not yet — legacy `DataTable`/`IndexTable` are large, stateful components (sorting, selection, pagination); a real wrapper needs its own pass, not a quick addition. |

## Media and visuals

| Web component | Status |
| --- | --- |
| `s-avatar` | ✅ `Avatar` |
| `s-thumbnail` | ✅ `Thumbnail` |
| `s-icon` | ✅ `Icon` |
| `s-image` | Not yet — a plain `<img>` covers most cases; low value-add over native HTML. |

## Overlays

| Web component | Status |
| --- | --- |
| `s-modal` | ✅ `Modal` |
| `s-popover` | Not yet — needs the same imperative-bridge treatment as `Modal`, deferred to keep this pass's scope finite. |

## Typography and content

| Web component | Status |
| --- | --- |
| `s-text` | ✅ `Text` |
| `s-tooltip` | ✅ `Tooltip` |
| `s-heading`, `s-paragraph` | Not yet — `Text`'s `variant` prop already covers heading/paragraph styling for legacy-parity purposes. |
| `s-chip` | Not yet — overlaps with `Badge`. |

## App Bridge (separate subsystem — see [app-bridge.md](./app-bridge.md))

| Element / API | Status |
| --- | --- |
| `s-app-window` | ✅ `AppWindow` |
| `s-app-nav` | ✅ `AppNav` |
| `ui-save-bar` | ✅ `SaveBar` |
| `window.shopify.toast` | ✅ `useToast()` |
| `window.shopify.saveBar` | ✅ `useSaveBar()` |
| `data-save-bar` / `data-discard-confirmation` (form attributes) | Documented only (plain HTML attributes, no wrapper needed) — see [app-bridge.md](./app-bridge.md#forms-with-a-save-bar). |
