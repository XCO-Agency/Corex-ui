# Contributing to Corex UI

Thanks for helping with `@xco-agency/corex-ui`. The library is the only package this repo publishes, and it is published to the public npm registry. The playground app is private and is not released.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Report security issues privately, as described in [SECURITY.md](SECURITY.md).

## Prerequisites

- Node.js 22 (the release workflow and `@changesets/changelog-github` require it; the library itself still declares `engines.node >= 18` at the workspace root)
- pnpm 10.30.3, pinned in the root `packageManager` field. Enable it with Corepack: `corepack enable`

## Setup

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm dev
```

`pnpm dev` starts the playground. `pnpm test` runs the library tests and the release-version checks. UI work in this repo follows [AGENTS.md](AGENTS.md): use Corex UI components, modern Polaris spacing tokens, and the prop types in `packages/corex-ui/src/components`.

## Contributors

1. Branch from `main`.
2. Change the library, the playground, or the docs.
3. If the change affects what users of `@xco-agency/corex-ui` get, add a changeset:

   ```sh
   pnpm changeset
   ```

   Pick `patch`, `minor`, or `major`, and write a short note that can go in the changelog. The prompt writes a markdown file under `.changeset/`. Commit that file with your change.

4. If you touched a releasable file (source, `packages/corex-ui/package.json`, the build config, or `packages/corex-ui/scripts`) but nothing should ship, record that explicitly:

   ```sh
   pnpm changeset --empty
   ```

   Docs, the playground, and CI files do not need a changeset. CI checks `pnpm exec changeset status` on pull requests and fails when a releasable file changed without one. The **Version Packages** pull request is exempt.

5. Open a pull request. CI installs dependencies, typechecks, tests, and builds. Fill in the pull request template, including how you tested.

Do not bump `packages/corex-ui/package.json` by hand and do not run `npm publish`. Version numbers and npm publishes happen through the maintainer flow below.

`packages/corex-ui/src/version.ts` is generated from `package.json` by [`scripts/sync-version.mjs`](packages/corex-ui/scripts/sync-version.mjs). Leave that script in place. `pnpm build` and the Version Packages script regenerate the file.

## Maintainers

Releasing is a merge, not a local publish.

1. Land feature pull requests that include changesets. Each merge to `main` updates the **Version Packages** pull request (branch `changeset-release/main`). That pull request runs `changeset version`, copies the library version onto the private root `package.json`, and regenerates `src/version.ts`.
2. Review the changelog and the version bump, then merge **Version Packages**.
3. That merge has no changesets left and the library version changed, so Release creates an annotated tag `vX.Y.Z` and a GitHub Release. The tag must match `packages/corex-ui/package.json` and the root `package.json`.
4. The publish workflow checks that equality, builds, tests, and runs `npm publish` for `@xco-agency/corex-ui`. A manual run defaults to a dry run and does not upload.

A push that does not change the version does not tag or publish. Versions already on npm are not backfilled with tags. The repository is at 2.3.2 and npm `latest` was 2.3.1 when this flow was added; merging the automation does not publish 2.3.2 by itself.

The workflow contract, secrets, dry run, and how to recover a failed publish are in [docs/releasing.md](docs/releasing.md).

GitHub Actions must be allowed to open pull requests (repository setting **Allow GitHub Actions to create and approve pull requests**). `NPM_TOKEN` must be a granular or automation token that can publish `@xco-agency/corex-ui`.
