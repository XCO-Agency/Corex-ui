# Corex UI

A pnpm workspace for **`@xco/corex-ui`**, a React component library for Shopify apps that
mirrors the legacy `@shopify/polaris` component API while rendering Shopify's actively
maintained Polaris web components underneath. It exists to make migrating off deprecated
Polaris React a matter of swapping an import, not rewriting a UI.

```diff
-import { Button, Card } from "@shopify/polaris";
+import { Button, Card } from "@xco/corex-ui";
```

## Layout

```
packages/corex-ui/    The publishable library — see its README for usage.
apps/playground/      A Vite app for manually exercising every component against the real
                       Polaris CDN script during development.
docs/                 Architecture, migration guide, and per-component prop-mapping docs.
```

## Getting started

```sh
pnpm install
pnpm build        # build the library
pnpm test         # run its unit tests
pnpm dev          # start the playground app
```

## Documentation

- [`packages/corex-ui/README.md`](./packages/corex-ui/README.md) — install & usage for the library itself.
- [`docs/architecture.md`](./docs/architecture.md) — how the wrapper layer works, and how to add new components.
- [`docs/migration-guide.md`](./docs/migration-guide.md) — moving an existing app off `@shopify/polaris`.
- [`docs/components/`](./docs/components/) — one page per component, with a legacy-prop-to-new-prop table.
