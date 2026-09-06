# Corex UI

A pnpm workspace for **`@xco-agency/corex-ui`**, a React component library for Shopify apps that
mirrors the legacy `@shopify/polaris` component API while rendering Shopify's actively
maintained Polaris web components underneath. It exists to make migrating off deprecated
Polaris React a matter of swapping an import, not rewriting a UI.

-import { Button, Card } from "@shopify/polaris";
+import { Button, Card } from "@xco-agency/corex-ui";

## Layout

packages/corex-ui/    The publishable library — see its README for usage.
apps/playground/      A Vite app for manually exercising every component against the real
                       Polaris CDN script during development — sidebar navigation grouped by
                       category, an overview of every component, and a live example + copyable
                       code per component.
docs/                 Architecture, migration guide, and per-component prop-mapping docs.

## Getting started

pnpm install
pnpm build        # build the library
pnpm test         # run its unit tests
pnpm dev          # start the playground app

## Publishing & Installation

The `@xco-agency/corex-ui` package is published to the **GitHub Packages** npm registry (not the
public npm registry), under the `@xco-agency` scope, matching the `XCO-Agency` GitHub org.

### For consumers: installing the package

Add an `.npmrc` (project-level or `~/.npmrc`) that routes the `@xco-agency` scope to GitHub
Packages and authenticates the request — GitHub Packages requires an authenticated request to
install a package even when it's public:

@xco-agency:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

`GITHUB_TOKEN` must be a GitHub personal access token with at least the `read:packages` scope.
With that in place:

npm install @xco-agency/corex-ui
# or
pnpm add @xco-agency/corex-ui

### For maintainers: publishing a release

1. Bump the version in [`packages/corex-ui/package.json`](./packages/corex-ui/package.json).
   Its `publishConfig.registry` points at `https://npm.pkg.github.com`, so `npm publish` targets
   GitHub Packages automatically.

2. Authenticate to GitHub Packages with a token that has `write:packages` scope (e.g. via the
   same `.npmrc` shape as above, or `npm login --registry=https://npm.pkg.github.com --scope=@xco-agency`).

3. Publish:
   ```sh
   cd packages/corex-ui
   npm publish
   ```
   (GitHub Packages doesn't use the `--access public` flag from the public npm registry —
   visibility follows the package/repository settings on GitHub.)

Or automatically via GitHub Actions release workflow (`.github/workflows/publish.yml`).

## Documentation

- [`packages/corex-ui/README.md`](./packages/corex-ui/README.md) — install & usage for the library itself.
- [`docs/architecture.md`](./docs/architecture.md) — how the wrapper layer works, and how to add new components.
- [`docs/migration-guide.md`](./docs/migration-guide.md) — moving an existing app off `@shopify/polaris`.
- [`docs/components/`](./docs/components/) — one page per component, with a legacy-prop-to-new-prop table.
