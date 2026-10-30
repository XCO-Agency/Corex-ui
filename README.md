# Corex UI

A pnpm workspace for **`@xco-agency/corex-ui`**, a React component library for Shopify apps that
mirrors the legacy `@shopify/polaris` component API while rendering Shopify's actively
maintained Polaris web components underneath. It exists to make migrating off deprecated
Polaris React a matter of swapping an import, not rewriting a UI.

```diff
-import { Button, Card } from "@shopify/polaris";
+import { Button, Card } from "@xco-agency/corex-ui";
```

## Layout

```
packages/corex-ui/    The publishable library — see its README for usage.
apps/playground/      A Vite app for manually exercising every component against the real
                       Polaris CDN script during development — sidebar navigation grouped by
                       category, an overview of every component, and a live example + copyable
                       code per component.
docs/                 Architecture, migration guide, and per-component prop-mapping docs.
```

## Getting started

```sh
pnpm install
pnpm build        # build the library
pnpm test         # run its unit tests
pnpm dev          # start the playground app
```

## Publishing & Installation

The `@xco-agency/corex-ui` package is published to the public npm registry.

### For consumers: installing the package

```sh
npm install @xco-agency/corex-ui
# or
pnpm add @xco-agency/corex-ui
```

No `.npmrc` configuration or authentication tokens are required.

### Contributing and releases

Add a changeset (`pnpm changeset`) when a pull request changes the published library. CI runs `pnpm install`, typecheck, test, and build on pull requests and on `main`.

Maintainers merge the **Version Packages** pull request. That merge creates an annotated tag `vX.Y.Z` matching `packages/corex-ui/package.json` (and the root `package.json`), opens the GitHub Release, and publishes to npm. Do not bump the version or run `npm publish` by hand. Tags already on GitHub for `0.0.1` and `0.0.2` are not backfilled.

- [CONTRIBUTING.md](./CONTRIBUTING.md) — setup, changesets, and the maintainer release steps
- [docs/releasing.md](./docs/releasing.md) — workflows, the tag check, dry run, and secrets
- [CHANGELOG.md](./CHANGELOG.md) — where release notes live
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [SECURITY.md](./SECURITY.md)

## AI Coding Assistant Skill

Add the official Corex UI skill to your AI coding agents (**Cursor**, **Claude Code**, **Antigravity**, **Copilot**):

```sh
pnpm dlx skills add XCO-Agency/Corex-ui
# or
npx skills add XCO-Agency/Corex-ui
```

## Documentation

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — local setup, changesets, and how a release is cut.
- [`packages/corex-ui/README.md`](./packages/corex-ui/README.md) — install & usage for the library itself.
- [`docs/agent-skills.md`](./docs/agent-skills.md) — setup guide for AI coding assistants (skills.sh, Cursor, Claude Code, Antigravity).
- [`docs/architecture.md`](./docs/architecture.md) — how the wrapper layer works, and how to add new components.
- [`docs/migration-guide.md`](./docs/migration-guide.md) — moving an existing app off `@shopify/polaris`.
- [`docs/components/`](./docs/components/) — one page per component, with a legacy-prop-to-new-prop table.
