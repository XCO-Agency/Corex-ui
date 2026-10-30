#!/usr/bin/env node
/**
 * Publish packages/corex-ui to public npm, or pack it with --dry-run.
 *
 * Real publishes require RELEASE_TAG to be v<version> and both package.json
 * versions to match. Set DRY_RUN=true to pack without uploading. --preflight
 * reports whether this version is already on npm so the workflow can skip
 * the build.
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync } from "node:fs";
import path from "node:path";

import {
  assertReleaseTag,
  assertVersionsInSync,
  interpretNpmView,
  isReleaseTag,
  npmDistTag,
  readVersions,
  repoRoot,
} from "./release-version.mjs";

const preflight = process.argv.includes("--preflight");
const dryRun = process.env.DRY_RUN === "true";
const tag = process.env.RELEASE_TAG ?? "";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function setOutput(key, value) {
  const line = `${key}=${value}`;
  if (!process.env.GITHUB_OUTPUT) {
    console.log(line);
    return;
  }
  appendFileSync(process.env.GITHUB_OUTPUT, `${line}\n`);
}

function assertTag() {
  const versions = readVersions();
  if (dryRun && tag && !isReleaseTag(tag)) {
    assertVersionsInSync(versions);
    console.log(
      `Dry run on ${tag}. ${versions.name} and the root package.json are both ${versions.package}.`,
    );
    return versions;
  }
  try {
    assertReleaseTag(tag, versions);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
  console.log(`Tag ${tag} matches ${versions.name}@${versions.package}.`);
  return versions;
}

function npmView(spec) {
  const result = spawnSync("npm", ["view", spec, "version"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const view = interpretNpmView(
    result.status ?? 1,
    result.stdout ?? "",
    result.stderr ?? "",
  );
  if (view.error) fail(`Could not check npm for ${spec}:\n${view.error}`);
  return view.published;
}

function main() {
  const versions = assertTag();
  const spec = `${versions.name}@${versions.package}`;

  if (preflight) {
    if (!dryRun && npmView(spec)) {
      console.log(`${spec} is already on npm. Skipping publish.`);
      setOutput("skip", "true");
      return;
    }
    setOutput("skip", "false");
    return;
  }

  if (!dryRun && npmView(spec)) {
    console.log(`${spec} is already on npm. Skipping publish.`);
    return;
  }

  const dist = path.join(repoRoot, "packages/corex-ui/dist/index.js");
  if (!existsSync(dist)) {
    fail("packages/corex-ui/dist is missing. Build the package before publishing.");
  }

  const args = ["publish", "--access", "public", "--tag", npmDistTag(versions.package)];
  if (dryRun) args.push("--dry-run");
  else args.push("--provenance");

  console.log(`npm ${args.join(" ")}`);
  const published = spawnSync("npm", args, {
    cwd: path.join(repoRoot, "packages/corex-ui"),
    stdio: "inherit",
  });
  if (published.status !== 0) {
    process.exit(published.status ?? 1);
  }
}

try {
  main();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
