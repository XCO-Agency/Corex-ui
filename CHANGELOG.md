# Changelog

Release notes for `@xco-agency/corex-ui` are written by Changesets to [`packages/corex-ui/CHANGELOG.md`](packages/corex-ui/CHANGELOG.md) and copied into the [GitHub Release](https://github.com/XCO-Agency/Corex-ui/releases) for each `vX.Y.Z` tag.

The tag matches `packages/corex-ui/package.json` and the root `package.json`. Tags that already exist for `0.0.1` and `0.0.2` are left alone. Versions that are already on npm are not given new tags.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/releasing.md](docs/releasing.md).

## 2026-11-13

### Added

- **Analytics Charts** block (`analytics-charts`): Rankify's Shopify-style analytics charts, available as a copy-in block via `npx @xco-agency/corex-ui@latest add analytics-charts` (#26).
- **Repeater** component: a reusable, generic repeater extracted from Rankify's collection editor conditions UI, with hover/keyboard-focus delete controls, configurable add menu, `maxItems` support, and an empty state (#25).
