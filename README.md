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

## Sponsored by

<p align="center">
  <a href="https://xco.agency/">
    <img src="https://xco.agency/cdn/shop/files/xco-logo-favicon.svg?v=1779704817" alt="XCO Agency" height="64">
  </a>
  <br>
  <a href="https://xco.agency/"><strong>XCO Agency</strong></a>
  <br>
  A Shopify Partner studio that builds apps and open-source tools for merchants and developers.
</p>

## Our Shopify apps

Live apps from [XCO Agency](https://apps.shopify.com/partners/xco-agency-llc) on the Shopify App Store:

<p align="center">
  <a href="https://apps.shopify.com/maestro-theme-scheduler"><img src="https://cdn.shopify.com/app-store/listing_images/d0379558a51d1acc51852963c848942b/icon/CJPqzMqlk5UDEAE=.png?height=128&width=128" alt="Maestro Theme Scheduler" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/claimify"><img src="https://cdn.shopify.com/app-store/listing_images/0e86cfa79304ba760ff5c0dfea158f4f/icon/COLtqMqX7owDEAE=.png?height=128&width=128" alt="Claimify" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/giftcard-balance-checker"><img src="https://cdn.shopify.com/app-store/listing_images/c24c83789f26433a0daf8bd3030a1290/icon/CKCdkfa_6JQDEAE=.png?height=128&width=128" alt="Gift Card Checker By Maestro" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/product-maestro-scheduler"><img src="https://cdn.shopify.com/app-store/listing_images/0e3d75727bc4d0cb1a92daecab959650/icon/CIym5dSPk5UDEAE=.png?height=128&width=128" alt="Maestro Products Scheduler" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/matchly-1"><img src="https://cdn.shopify.com/app-store/listing_images/f20f6886978f7351fdb3c8f23bac93e0/icon/CIXe_fuE7JQDEAE=.png?height=128&width=128" alt="Matchly" height="56"></a>
</p>
<p align="center">
  <a href="https://apps.shopify.com/rankify-smart-collection-sort"><img src="https://cdn.shopify.com/app-store/listing_images/d809aacde0790319c5c5edabfb74bb07/icon/CM-W_sPrvZQDEAE=.png?height=128&width=128" alt="Rankify" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/theme-visibility-scheduler"><img src="https://cdn.shopify.com/app-store/listing_images/40e800daef20e67cbb6666bb38af6a7a/icon/COfAjLqkk5UDEAE=.png?height=128&width=128" alt="Maestro Visibility Scheduler" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/maestro-collections-schedule"><img src="https://cdn.shopify.com/app-store/listing_images/7859caa027c036416fc2e77d11dc67b6/icon/CMju4tDkk5UDEAE=.png?height=128&width=128" alt="Maestro Collections Scheduler" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/prizify-loyalty-rewards"><img src="https://cdn.shopify.com/app-store/listing_images/c184183a972fc18efe350eee1817e244/icon/CPSHq7fhk5UDEAE=.png?height=128&width=128" alt="Prizify" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/floaty"><img src="https://cdn.shopify.com/app-store/listing_images/b75dcf7a389c14defbc45c7cf8b6c47a/icon/CLamgY_J6JQDEAE=.png?height=128&width=128" alt="Floaty" height="56"></a>
</p>
<p align="center">
  <a href="https://apps.shopify.com/cartify-multi-carts-sharing"><img src="https://cdn.shopify.com/app-store/listing_images/300aacf0fbe583a640e4af826c769e4c/icon/COaPidnQk5UDEAE=.png?height=128&width=128" alt="Journeva" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/workify"><img src="https://cdn.shopify.com/app-store/listing_images/f5da8f37b29aa8815689b736d8c10366/icon/CLm8j_Ci5pQDEAE=.png?height=128&width=128" alt="Workify" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/subscriptions-5"><img src="https://cdn.shopify.com/app-store/listing_images/77d808205f80e245ae94d1590d3f4ce9/icon/CJqE6-PuxpQDEAE=.png?height=128&width=128" alt="SubFlow" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/quick-notice-clear-alert"><img src="https://cdn.shopify.com/app-store/listing_images/e086f1c5a055cc1dabc27a58d413fa8a/icon/CPH0476ck5UDEAE=.png?height=128&width=128" alt="Quick Notice" height="56"></a>&nbsp;&nbsp;
  <a href="https://apps.shopify.com/order-helper-dev"><img src="https://cdn.shopify.com/app-store/listing_images/44a3fb7a04a22d6d857209abef5ab4f1/icon/CIWwv-ukk5UDEAE=.png?height=128&width=128" alt="ORDA" height="56"></a>
</p>

<p align="center">
  <a href="https://apps.shopify.com/maestro-theme-scheduler">Theme Scheduler</a> ·
  <a href="https://apps.shopify.com/claimify">Claimify</a> ·
  <a href="https://apps.shopify.com/giftcard-balance-checker">Gift Card Checker</a> ·
  <a href="https://apps.shopify.com/product-maestro-scheduler">Products Scheduler</a> ·
  <a href="https://apps.shopify.com/matchly-1">Matchly</a> ·
  <a href="https://apps.shopify.com/rankify-smart-collection-sort">Rankify</a> ·
  <a href="https://apps.shopify.com/theme-visibility-scheduler">Visibility Scheduler</a> ·
  <a href="https://apps.shopify.com/maestro-collections-schedule">Collections Scheduler</a> ·
  <a href="https://apps.shopify.com/prizify-loyalty-rewards">Prizify</a> ·
  <a href="https://apps.shopify.com/floaty">Floaty</a> ·
  <a href="https://apps.shopify.com/cartify-multi-carts-sharing">Journeva</a> ·
  <a href="https://apps.shopify.com/workify">Workify</a> ·
  <a href="https://apps.shopify.com/subscriptions-5">SubFlow</a> ·
  <a href="https://apps.shopify.com/quick-notice-clear-alert">Quick Notice</a> ·
  <a href="https://apps.shopify.com/order-helper-dev">ORDA</a>
</p>
