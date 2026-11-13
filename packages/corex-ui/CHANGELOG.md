# @xco-agency/corex-ui

## 2.5.0

### Minor Changes

- [#26](https://github.com/XCO-Agency/Corex-ui/pull/26) [`5ead494`](https://github.com/XCO-Agency/Corex-ui/commit/5ead494f353e0b2e7106349cc63175365f02cde7) Thanks [@anasbenallaa](https://github.com/anasbenallaa)! - Add the **Analytics Charts** block (`npx @xco-agency/corex-ui@latest add analytics-charts`): Shopify admin-style metric cards, a line chart with a dashed comparison period, a column chart, a conversion funnel, a ranked bar list, a donut and a sparkline, drawn as dependency-free SVG with hover and keyboard tooltips. Labels and number/date formatting are all passed in as props.

- [#25](https://github.com/XCO-Agency/Corex-ui/pull/25) [`e0f9810`](https://github.com/XCO-Agency/Corex-ui/commit/e0f98101512d636dbbcb5d827ebace22eaf46ef3) Thanks [@anasbenallaa](https://github.com/anasbenallaa)! - New `Repeater`: repeated condition rows (rounded cards with field and operator pills, a value area under a divider, a trash button that shows on hover or keyboard focus and removes the row at once), an add button with an optional menu, an end slot, an empty state, and a `maxItems` limit with a note. Ships with `Repeater.Pill`, `Repeater.Options`, and, for multi-value rows, `Repeater.TagsInput` (chips joined by AND / OR, added on Enter or a comma) and `Repeater.MatchMode` (the All / Any pill, lockable). The trash button has a tooltip (`removeTooltip`), and `Options` gets a search field past 10 options (`searchable`, `searchThreshold`, `searchPlaceholder`, `noResultsText`).

- [`04ad1a5`](https://github.com/XCO-Agency/Corex-ui/commit/04ad1a56082b6bd4270e64b7515f1889de6b62d3) Thanks [@soufiyanbenallal](https://github.com/soufiyanbenallal)! - Custom saved views in the compact tab list can be edited or removed from a menu on each view.

### Patch Changes

- [`1629849`](https://github.com/XCO-Agency/Corex-ui/commit/1629849672281165f175f591c3f16b2c76632651) Thanks [@soufiyanbenallal](https://github.com/soufiyanbenallal)! - ButtonGroup assigns each child button to `primary-action` or `secondary-actions` so `s-button-group` renders it.

- [`04ad1a5`](https://github.com/XCO-Agency/Corex-ui/commit/04ad1a56082b6bd4270e64b7515f1889de6b62d3) Thanks [@soufiyanbenallal](https://github.com/soufiyanbenallal)! - Icon-only tabs and segment options size to a square that matches the control height.

- [#25](https://github.com/XCO-Agency/Corex-ui/pull/25) [`ca2ec5a`](https://github.com/XCO-Agency/Corex-ui/commit/ca2ec5a1ae98d066c264e0594541d73903a8e6e5) Thanks [@anasbenallaa](https://github.com/anasbenallaa)! - Fix Navigation clipping when scrolled inside a parent by mirroring `blockSize` onto the inner stack (pass `blockSize="auto"` for content-sized sidebars).

- [`a822b8b`](https://github.com/XCO-Agency/Corex-ui/commit/a822b8bb80f7f18d47fab6947c1b2fb18181d0d7) Thanks [@soufiyanbenallal](https://github.com/soufiyanbenallal)! - Page places composite `aside` content in the sidebar slot, even when the component does not forward `slot`.

## 2.4.1

### Patch Changes

- Republish 2.4.0 contents with a fresh build. npm `2.4.0` was published from a stale `dist` (embedded `COREX_UI_VERSION` `2.3.1`) and omitted `RichTextEditor`, `Segment`, and `Media`.

## 2.4.0

### Minor Changes

- [`e0b7032`](https://github.com/XCO-Agency/Corex-ui/commit/e0b7032ebdf14a4e0659db42e9a1e2cbf4f3cf29) Thanks [@soufiyanbenallal](https://github.com/soufiyanbenallal)! - Add DropZone `size="small"` for a square, icon-only upload surface, with `inlineSize` and `icon` controls.

- [`40621aa`](https://github.com/XCO-Agency/Corex-ui/commit/40621aad059bca6f3f610e81451c3777140e81c6) Thanks [@soufiyanbenallal](https://github.com/soufiyanbenallal)! - Add composable `Media` compound for media libraries — Body/Filters/ViewToggle, grid/list browse, selection, hover preview chip, upload strip, and detail panel.

- [`e0b7032`](https://github.com/XCO-Agency/Corex-ui/commit/e0b7032ebdf14a4e0659db42e9a1e2cbf4f3cf29) Thanks [@soufiyanbenallal](https://github.com/soufiyanbenallal)! - Selectable `indicator` accepts `"checkbox"` / `"radio"` for inset top-start marks; `indicator={true}` keeps the default corner badge.

- [`b492cd9`](https://github.com/XCO-Agency/Corex-ui/commit/b492cd9bbc07fc18f72ad493e569591f7fc45a1b) Thanks [@soufiyanbenallal](https://github.com/soufiyanbenallal)! - Add Segment, a pill segmented control with optional label and default/primary variants. Restyle Tabs with a Segment pill track, fully rounded compact mode, and a card/folder variant with `Tabs.Content`.

## 2.3.4

### Patch Changes

- [#18](https://github.com/XCO-Agency/Corex-ui/pull/18) [`ce122e3`](https://github.com/XCO-Agency/Corex-ui/commit/ce122e3eb548653e8b55f9ce9ba999dbe66ebf25) Thanks [@ansezz](https://github.com/ansezz)! - Fix layout and field behavior the component docs already described. `BlockStack` and `InlineStack` `shrink` maps `true` to flex-shrink 1, `false` to 0, and a number to that flex-shrink value. `TextContainer` uses the loose (`base`) and tight (`small-200`) rhythms. `MoneyField` `onChange` fires on each keystroke. App Bridge modals mount their SaveBar as a child of the modal. A fixed IndexFilters column keeps its drag handle and disables it.

## 2.3.2

### Patch Changes

- Current version in the repository. npm `latest` when this changelog was seeded was 2.3.1. Older GitHub tags (`0.0.1`, `0.0.2`) are not rewritten, and this entry is not a reconstructed history. Later releases are added above by Changesets.
