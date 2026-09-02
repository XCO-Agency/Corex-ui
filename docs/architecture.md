# Architecture

`@xco/corex-ui` wraps Shopify's Polaris web components (`s-*` custom elements) behind a
React API that mirrors legacy `@shopify/polaris` component names and props. This document
explains how the wrapper layer is built and how to extend it.

## Layers

```
apps/playground        Manual QA app (loads the real polaris-1.js CDN script)
packages/corex-ui/
  src/
    core/               React <-> web-component integration layer (the seam)
    components/          One folder per public component
    hooks/                Global-JS-API hook bridges (useToast, useSaveBar)
    types/                Shared prop unions + ambient s-*/App Bridge element typings
    utils/                devWarning, small helpers
    test-utils/           jsdom stand-ins for s-* elements, test-only
    index.ts              Public barrel export (the only intended import path)
```

Consumers only ever import from the barrel (`src/index.ts`). Everything under `core/`,
`utils/`, and `test-utils/` is internal and intentionally not re-exported, so it can change
without being a breaking change for consumers.

## The integration layer: `core/createWebComponent`

Every component wrapper is built on `createWebComponent(tagName, options)`
([`src/core/createWebComponent.tsx`](../packages/corex-ui/src/core/createWebComponent.tsx)),
which returns a `forwardRef` React component rendering the given `s-*` tag. It handles the
three places where React conventions and web-component conventions diverge:

1. **DOM properties vs. attributes.** Primitive props (strings, booleans) pass straight
   through as JSX props — React's own custom-element handling assigns them as attributes or
   properties as appropriate. Anything listed in `options.domProps` is instead assigned
   unconditionally as a live DOM *property* (`el[key] = value`, never an attribute) via
   [`assignDomProp`](../packages/corex-ui/src/core/assignDomProp.ts) inside a
   `useLayoutEffect`. A wrapper lists a prop in `domProps` precisely because it's already
   decided the value must stay a live property — non-primitive values (`ChoiceList`'s
   `choices`/`selected`) that would otherwise be stringified as an attribute, or a controlled
   value (`TextField`/`Select`/`DateField`/`DatePicker`'s `value`/`selected`, `Checkbox`'s
   `checked`) that must stay in sync on every render — matching how native `<input>`
   distinguishes its live `.value` property from its initial, attribute-driven default.
2. **Events.** `options.events` maps a React-style prop name (`onClick`) to the native DOM
   event Polaris actually fires (`click`). [`useDomEvent`](../packages/corex-ui/src/core/useDomEvent.ts)
   binds a real `addEventListener`, keeping the latest handler in a ref so the subscription
   itself is created once per element rather than on every render.
3. **Refs.** The `ref` a consumer passes is forwarded straight to the underlying custom
   element (merged with the factory's own internal ref via
   [`mergeRefs`](../packages/corex-ui/src/core/mergeRefs.ts)), matching Shopify's own
   documented pattern (`modalRef.current.hideOverlay()`) instead of an opaque
   `useImperativeHandle` wrapper — consumers may need DOM methods this library doesn't know
   about yet.

## Four component authoring patterns

Every component in `src/components/` follows one of these. Pick whichever fits when adding a
new one — none of them require touching `core/`.

### 1. Thin wrapper

Used by most components — `Button`, `Badge`, `Text`, `Box`, `Spinner`, `ButtonGroup`, `Link`,
`Icon`, `Divider`, `Avatar`, `Thumbnail`, `Menu`, `AppNav`, `SaveBar`, and others. The legacy
component's props map close to 1:1 onto the new element's attributes/properties. The wrapper is
a small function that renames/translates a handful of legacy prop names (e.g. `Button`'s legacy
`primary`/`destructive` booleans become `variant`/`tone`) and calls `createWebComponent` once.

### 2. Controlled form input

Used by `TextField`, `Select`, `Checkbox`, `ChoiceList`, `DateField`, `DatePicker`. These bridge
a real behavioral difference: legacy Polaris `TextField.onChange` fires on **every keystroke**,
while the new element's own `onChange` only fires on blur/commit — its `onInput` is the
per-keystroke event. The wrapper binds `onInput` internally and calls the consumer's
`onChange(value, id)` from it, so existing call sites keep their expected behavior.
`value`/`checked`/`selected`/`choices` are declared in `domProps` so they're always set as a
live DOM property (see above), which is what makes the component genuinely controlled.

### 3. Composed / imperative bridge

Used by `Card`, `Modal`, `Page`, `BlockStack`, `InlineStack`, `Tabs`, `Tooltip`, `AppWindow`.
These either have no 1:1 web component, or the new element needs imperative calls to satisfy the
legacy declarative API:

- `Card` has no `s-card` — it's `s-section` with an optional `Text`-based heading composed in.
- `BlockStack`/`InlineStack` are both `s-stack`, pinned to `direction="block"` /
  `direction="inline"` via `staticAttributes`.
- `Modal`'s legacy `open`/`onClose` props are translated in a `useEffect` into calls to the
  ref'd element's `show()`/`hideOverlay()` methods, and the element's native `close` event is
  listened for (via `useDomEvent`) and turned back into `onClose()` — bridging declarative
  React state onto an imperative DOM API in both directions. `Page` follows the same
  action-composition convention for its `primaryAction`/`secondaryActions`.
- `Tabs` has no native equivalent at all. It's built entirely from `ButtonGroup` + `Button` +
  local `useState`, and renders no `s-*` element of its own.
- `Tooltip` composes a trigger child with a `slot="content"` child — no imperative bridge needed
  since tooltips are natively hover/focus-driven.
- `AppWindow` (see [app-bridge.md](./app-bridge.md)) forwards its ref for imperative
  `.show()`/`.hide()` calls, like `Modal`, but — unlike `Modal` — has no controlled `open`/
  `onClose` prop, since there's no confirmed close event for it.

### 4. App Bridge hook bridge

Used by `useToast`/`useSaveBar` (`src/hooks/`). Some App Bridge functionality isn't a custom
element at all — it's an imperative global JS API (`window.shopify.toast.show(...)`,
`window.shopify.saveBar.show(id)`). These hooks wrap that global in a small React hook returning
a stable (`useMemo`'d) object of methods, and — since `window.shopify` only exists inside a real
embedded Shopify admin session — no-op with a `devWarning` instead of throwing when it's absent.
This is the one pattern with no DOM ref or `createWebComponent` involved at all.

## Dev-mode warnings for unsupported props

When a legacy prop has no faithful translation (e.g. `Card`'s `sectioned`, `Button`'s
`pressed`), the wrapper calls [`devWarning`](../packages/corex-ui/src/utils/devWarning.ts),
which logs once per component+message in development only (stripped via a
`process.env.NODE_ENV` check in production builds). This surfaces migration gaps instead of
silently dropping behavior.

## Adding a new component

1. Create `src/components/<Name>/` with `<Name>.tsx`, `<Name>.types.ts`, `<Name>.test.tsx`,
   `index.ts`.
2. Pick the closest of the four patterns above.
3. Call `createWebComponent` (directly, or via a component you compose from) — declare
   `events` for anything the legacy API expects as a callback prop, and `domProps` for any
   value that must be a live property (objects, arrays, or anything a controlled component
   needs to stay in sync). Add the tag to
   [`src/test-utils/registerPolarisStubs.ts`](../packages/corex-ui/src/test-utils/registerPolarisStubs.ts)'s
   `STUB_TAGS` list (only if it needs special methods beyond a generic element, add a dedicated
   stub class like `ModalStub`/`AppWindowStub`).
4. Add a dev-mode `devWarning` for any legacy prop you can't translate.
5. Export the component and its prop type from `src/index.ts`.
6. Add a `docs/components/<name>.md` following the existing files' format, and a row in
   [component-coverage.md](./component-coverage.md).
7. Add it to the matching `apps/playground/src/data/categories/*.tsx` file (create a new
   category file only if it doesn't fit an existing one) and a thumbnail in
   `apps/playground/src/components/icons/ComponentThumbnails.tsx`, then check it manually in
   the playground against the real CDN script — the unit tests run against jsdom stand-ins,
   not the real Polaris runtime, so they only prove the prop/event translation is correct, not
   that the real element accepts the attribute names used.

## A caveat on exact web-component APIs

Polaris web components are a new (2025/2026), fast-moving API surface, and Shopify's most
detailed per-component reference pages are not consistently reachable outside an authenticated
session. Several attribute/slot names used in this library's first-wave components (in
particular `Modal`'s action slots, `Page`'s `backAction`, and `Button`'s `pressed`/`fullWidth`)
are **best-effort**, based on the publicly available category listing, changelog, and usage
snippets rather than a confirmed full API reference. These are called out with either a
`devWarning` or a code comment. Before shipping to production, verify assumptions against the
exact `polaris-1.x` version your app loads, and tighten the corresponding wrapper if an
attribute name doesn't match.

The App Bridge components (`AppWindow`, `AppNav`, `Menu`, `SaveBar`, the `command`/`commandFor`
pattern, `useToast`/`useSaveBar`) are the exception — those were implemented directly from
concrete, working markup supplied during development rather than researched secondhand, so
treat them as more reliable than the best-effort notes elsewhere. `s-app-window`'s exact close
behavior is still unconfirmed, which is why `AppWindow` has no `onClose` prop (see
[app-bridge.md](./app-bridge.md)).
