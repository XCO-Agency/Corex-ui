#!/usr/bin/env node
/**
 * Fail the publish job unless the git tag is an annotated v<package.json version>
 * and the root package.json version matches @xco-agency/corex-ui.
 *
 * --require-tag            tag is mandatory (real npm publish)
 * --allow-non-release-ref  a branch name is allowed; a v* tag is still checked
 * --tag <ref>              git ref to check
 */
import { spawnSync } from "node:child_process";

import {
  assertAnnotatedTagType,
  assertReleaseTag,
  assertVersionsInSync,
  isReleaseTag,
  readVersions,
  repoRoot,
} from "./release-version.mjs";

function readFlag(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function assertAnnotated(tag) {
  const result = spawnSync("git", ["cat-file", "-t", tag], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      `Could not inspect git tag ${tag}.\n${result.stderr || result.stdout || `exit ${result.status}`}`,
    );
  }
  assertAnnotatedTagType(result.stdout.trim(), tag);
}

try {
  const requireTag = process.argv.includes("--require-tag");
  const allowNonReleaseRef = process.argv.includes("--allow-non-release-ref");
  const tag = readFlag("--tag") ?? "";
  const versions = readVersions();

  if (requireTag || isReleaseTag(tag)) {
    assertReleaseTag(tag, versions);
    assertAnnotated(tag);
    console.log(
      `Annotated tag ${tag} matches ${versions.name}@${versions.package} and the root package.json version.`,
    );
  } else if (tag && !allowNonReleaseRef) {
    assertReleaseTag(tag, versions);
    assertAnnotated(tag);
  } else {
    assertVersionsInSync(versions);
    console.log(
      tag
        ? `Ref ${tag} is not a release tag. ${versions.name} and the root package.json are both ${versions.package}.`
        : `${versions.name} and the root package.json are both ${versions.package}.`,
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
