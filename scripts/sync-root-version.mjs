#!/usr/bin/env node
/**
 * Copies packages/corex-ui/package.json "version" onto the private workspace
 * root. Changesets only bumps the library; the root version is kept in lockstep
 * so a vX.Y.Z tag matches both files.
 *
 * Does not edit scripts/sync-version.mjs. That script still regenerates
 * packages/corex-ui/src/version.ts and is invoked separately.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { readVersions, replaceVersionField, repoRoot } from "./release-version.mjs";

const versions = readVersions();
const rootPath = path.join(repoRoot, "package.json");
const raw = readFileSync(rootPath, "utf8");
const next = replaceVersionField(raw, versions.package);

if (next === raw) {
  console.log(`[sync-root-version] root package.json already at ${versions.package}`);
} else {
  writeFileSync(rootPath, next);
  console.log(
    `[sync-root-version] root package.json ${versions.root} -> ${versions.package}`,
  );
}
