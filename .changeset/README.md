# Changesets

This folder holds pending release notes for `@xco-agency/corex-ui`.

Add one with `pnpm changeset` when a pull request changes the published library. Use `pnpm changeset --empty` when a package file changed but nothing should be released.

Merging to `main` opens or updates the **Version Packages** pull request. Merging that pull request is what cuts the next `vX.Y.Z` release. See [CONTRIBUTING.md](../CONTRIBUTING.md) and [docs/releasing.md](../docs/releasing.md).
