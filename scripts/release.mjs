#!/usr/bin/env node
/**
 * Changesets publish script.
 *
 * Runs on every push to main that has no pending changesets. It creates an
 * annotated vX.Y.Z tag and a GitHub Release only when this commit bumped
 * @xco-agency/corex-ui and that version is not already on npm. npm publish
 * itself is .github/workflows/publish.yml, which asserts the tag before
 * publishing. Historical tags are not backfilled.
 *
 * Pass --dry-run to print the decision without tagging or calling GitHub.
 * Outside GitHub Actions the script refuses to tag unless --dry-run is set.
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  assertAnnotatedTagType,
  assertVersionsInSync,
  changelogSection,
  interpretNpmView,
  readVersions,
  releaseDecision,
  releaseTagFor,
  repoRoot,
  versionFromPackageJson,
} from "./release-version.mjs";

const dryRun = process.argv.includes("--dry-run");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function git(args) {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed:\n${result.stderr || result.stdout || `exit ${result.status}`}`,
    );
  }
  return (result.stdout ?? "").trim();
}

function npmView(spec) {
  const result = spawnSync("npm", ["view", spec, "version"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return interpretNpmView(result.status ?? 1, result.stdout ?? "", result.stderr ?? "");
}

function markChangesetsOutput() {
  if (!process.env.CHANGESETS_OUTPUT) return;
  writeFileSync(process.env.CHANGESETS_OUTPUT, "");
}

function readParentVersion() {
  try {
    return versionFromPackageJson(git(["show", "HEAD^:packages/corex-ui/package.json"]));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return "";
  }
}

function commitOf(ref) {
  const result = spawnSync("git", ["rev-parse", "--verify", `${ref}^{commit}`], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function assertExistingTagIsAnnotated(tag) {
  const result = spawnSync("git", ["cat-file", "-t", tag], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    fail(`Could not inspect git tag ${tag}.\n${result.stderr || result.stdout}`);
  }
  assertAnnotatedTagType(result.stdout.trim(), tag);
}

function ensureAnnotatedTag(tag, head) {
  const local = commitOf(tag);
  if (local && local !== head) {
    fail(`Tag ${tag} already points at ${local}, not ${head}.`);
  }
  const remote = git(["ls-remote", "--tags", "origin", `refs/tags/${tag}`]);
  if (remote) {
    git(["fetch", "origin", `refs/tags/${tag}:refs/tags/${tag}`, "--force"]);
    const fetched = commitOf(tag);
    if (fetched !== head) {
      fail(`Remote tag ${tag} points at ${fetched ?? "unknown"}, not ${head}.`);
    }
    assertExistingTagIsAnnotated(tag);
    console.log(`Annotated tag ${tag} already points at this commit.`);
    return;
  }
  if (!local) {
    git(["config", "user.name", "github-actions[bot]"]);
    git([
      "config",
      "user.email",
      "41898282+github-actions[bot]@users.noreply.github.com",
    ]);
    const message = `${tag}\n\n@xco-agency/corex-ui@${tag.slice(1)}`;
    git(["tag", "-a", tag, "-m", message]);
    console.log(`Created annotated tag ${tag}.`);
  } else {
    assertExistingTagIsAnnotated(tag);
  }
  git(["push", "origin", `refs/tags/${tag}`]);
  console.log(`Pushed ${tag}.`);
}

function releaseNotes(version) {
  const changelogPath = path.join(repoRoot, "packages/corex-ui/CHANGELOG.md");
  const changelog = readFileSync(changelogPath, "utf8");
  const section = changelogSection(changelog, version);
  if (!section) {
    fail(`packages/corex-ui/CHANGELOG.md has no "## ${version}" section.`);
  }
  return `${section}\n`;
}

function ensureGithubRelease(tag, version) {
  const view = spawnSync("gh", ["release", "view", tag, "--json", "tagName"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (view.status === 0) {
    console.log(`GitHub Release ${tag} already exists.`);
    return;
  }
  const notesPath = path.join(tmpdir(), `corex-ui-${tag}.md`);
  writeFileSync(notesPath, releaseNotes(version));
  const args = [
    "release",
    "create",
    tag,
    "--title",
    tag,
    "--notes-file",
    notesPath,
    "--verify-tag",
  ];
  if (version.includes("-")) args.push("--prerelease");
  const created = spawnSync("gh", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (created.status !== 0) {
    fail(`gh release create ${tag} failed:\n${created.stderr || created.stdout}`);
  }
  console.log(created.stdout.trim());
}

function main() {
  if (!dryRun && process.env.GITHUB_ACTIONS !== "true") {
    fail(
      "Refusing to tag or open a GitHub Release outside GitHub Actions. Pass --dry-run to preview.",
    );
  }

  const versions = readVersions();
  assertVersionsInSync(versions);

  const headVersion = versionFromPackageJson(
    git(["show", "HEAD:packages/corex-ui/package.json"]),
  );
  if (headVersion !== versions.package) {
    fail(
      `Working tree version ${versions.package} does not match HEAD (${headVersion}). Refusing to tag.`,
    );
  }

  const previousVersion = readParentVersion();
  let published = false;
  if (previousVersion && previousVersion !== versions.package) {
    const view = npmView(`${versions.name}@${versions.package}`);
    if (view.error) {
      fail(`Could not check npm before tagging:\n${view.error}`);
    }
    published = view.published;
  }

  const decision = releaseDecision({
    previousVersion,
    currentVersion: versions.package,
    published,
  });
  console.log(decision.reason);

  if (decision.action === "error") fail(decision.reason);
  if (decision.action === "skip") {
    markChangesetsOutput();
    return;
  }

  const tag = decision.tag ?? releaseTagFor(versions.package);
  if (dryRun) {
    console.log(
      `Dry run: would create annotated tag ${tag} and a GitHub Release. npm publish stays in publish.yml.`,
    );
    return;
  }

  const head = git(["rev-parse", "HEAD"]);
  ensureAnnotatedTag(tag, head);
  ensureGithubRelease(tag, versions.package);
  writeFileSync(path.join(repoRoot, "release-tag.txt"), `${tag}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `Created GitHub Release \`${tag}\`. npm publish runs in the next job after the tag check.\n`,
    );
  }
  markChangesetsOutput();
}

try {
  main();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
