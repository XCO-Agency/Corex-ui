# Migrating from `@shopify/polaris`

`@shopify/polaris` (Polaris React) is deprecated. `@xco/corex-ui` gives you the same component
names and the same prop shapes, backed by Shopify's actively-maintained Polaris web components,
so you can migrate one file — even one component — at a time.

## 1. Install

```sh
npm install @xco/corex-ui
npm install --save-dev @shopify/polaris-types
```

`@xco/corex-ui` has no runtime dependency on Polaris itself — the actual `s-*` elements are
provided by Shopify's CDN script, not an npm package. `@shopify/polaris-types` is optional but
recommended: it gives you accurate ambient TypeScript types for the underlying elements,
versioned to match the CDN script your app loads.

## 2. Load the Polaris web components script

Add this to your app's HTML `<head>` (Shopify CLI-scaffolded apps already have this):

```html
<script src="https://cdn.shopify.com/shopifycloud/polaris-1.js"></script>
```

Pin a specific release with `polaris-1.1.js` etc. if you need to control update timing; the
unpinned `polaris-1.js` always tracks the latest stable v1 release.

Unlike Polaris React, there is no `<AppProvider>` to render — the CDN script registers the
custom elements globally as soon as it loads, and Polaris web components are styled globally
by that same script rather than by a React context provider.

## 3. Swap imports, component by component

```diff
-import { Button, Card } from "@shopify/polaris";
+import { Button, Card } from "@xco/corex-ui";
```

Both libraries can run side by side during a migration — they don't share any global state or
CSS, so converting one page or one component at a time is safe. There's no codemod; this is a
deliberate, low-risk, incremental swap.

## 4. Known behavior differences

Most components map closely, but a few are worth knowing about before you swap:

| Component | Difference |
| --- | --- |
| `Card` | No native `s-card` exists — it's composed from `s-section`. The legacy `sectioned` prop is a no-op (every `Card` already renders as one section); a dev-mode warning tells you if you're still passing it. |
| `Modal` | Legacy `open`/`onClose` still work exactly the same from the outside, but internally the wrapper now calls the underlying element's imperative `show()`/`hideOverlay()` methods rather than toggling an attribute — no change needed in your code. |
| `TextField` / `Select` | `onChange` still fires on every keystroke/selection, matching legacy behavior — it's now bound to the new element's `onInput`, since the new element's own `onChange` only fires on blur/commit. |
| `TextField` | `multiline` now renders `s-text-area` under the hood instead of `s-text-field`; this is transparent to your code. |
| `Tabs` | No native tab component exists yet — it's composed from `ButtonGroup`/`Button`, so very custom `Tabs` styling overrides from the old library won't carry over automatically. |
| `Button` | `pressed` and `fullWidth` are forwarded best-effort (no confirmed equivalent on `s-button` as of this writing) — a dev-mode warning flags `pressed` specifically; verify visually if you rely on it. |
| `Page` | `backAction` has no confirmed equivalent yet and is accepted for API compatibility only (with a dev warning) — it currently has no visual effect. |

See [`docs/architecture.md`](./architecture.md) for why these gaps exist and how they're
tracked (`devWarning`), and each `docs/components/*.md` file for the full prop-mapping table of
that specific component.

## 5. Rollout suggestion

1. Add the CDN script tag and `@xco/corex-ui` dependency; leave `@shopify/polaris` installed.
2. Pick one low-traffic page or component and swap its import. Click through it manually — the
   visual language should look identical, since both libraries render Shopify's own design
   system.
3. Watch the browser console in development for `[@xco/corex-ui]` warnings — they tell you
   exactly which props need a second look.
4. Repeat page by page. Once nothing imports from `@shopify/polaris` anymore, remove it and its
   `<AppProvider>`/theme setup.

## 6. Components not yet covered

This library currently ships a first-wave set of ~16 components (see the
[README](../packages/corex-ui/README.md) for the full list) chosen to cover every wrapper
pattern needed. If a component you use isn't here yet, it can be added following the pattern in
[`docs/architecture.md`](./architecture.md#adding-a-new-component) without any changes to the
existing components or the core integration layer.
