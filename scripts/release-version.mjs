/**
 * Pure helpers for the @xco-agency/corex-ui release.
 *
 * The published version lives in packages/corex-ui/package.json. The root
 * package.json version is kept identical by scripts/sync-root-version.mjs.
 * Git tags are annotated SemVer tags vX.Y.Z — not @xco-agency/corex-ui@X.Y.Z.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const SEMVER = /^\d+\.\d+\.\d+(?:[-+].+)?$/;

export function readVersions(root = repoRoot) {
  const pkg = JSON.parse(
    readFileSync(path.join(root, "packages/corex-ui/package.json"), "utf8"),
  );
  const rootPkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  return {
    name: pkg.name,
    package: pkg.version,
    root: rootPkg.version,
  };
}

export function versionFromPackageJson(raw) {
  const parsed = JSON.parse(raw);
  if (typeof parsed.version !== "string" || parsed.version.length === 0) {
    throw new Error('package.json is missing a string "version".');
  }
  return parsed.version;
}

export function replaceVersionField(raw, version) {
  const pattern = /("version"\s*:\s*")([^"]+)(")/;
  const match = pattern.exec(raw);
  if (!match) {
    throw new Error('package.json is missing a "version" field.');
  }
  if (match[2] === version) return raw;
  return raw.replace(pattern, `$1${version}$3`);
}

export function assertVersionsInSync(versions) {
  if (versions.name !== "@xco-agency/corex-ui") {
    throw new Error(`Refusing to release unexpected package ${versions.name}.`);
  }
  if (versions.root !== versions.package) {
    throw new Error(
      `Root package.json version ${versions.root} does not match ${versions.name} version ${versions.package}.`,
    );
  }
  if (!SEMVER.test(versions.package)) {
    throw new Error(`Unsupported version ${versions.package}. Expected SemVer.`);
  }
}

export function releaseTagFor(version) {
  return `v${version}`;
}

export function isReleaseTag(tag) {
  return typeof tag === "string" && /^v\d+\.\d+\.\d+(?:[-+].+)?$/.test(tag);
}

export function assertReleaseTag(tag, versions) {
  assertVersionsInSync(versions);
  const expected = releaseTagFor(versions.package);
  if (!isReleaseTag(tag)) {
    throw new Error(
      `Ref ${JSON.stringify(tag)} is not a SemVer release tag. Expected ${expected}.`,
    );
  }
  if (tag !== expected) {
    throw new Error(
      `Tag ${tag} does not match ${versions.name} package.json version ${versions.package} (expected ${expected}).`,
    );
  }
}

/** `git cat-file -t <tag>` is `tag` for an annotated tag and `commit` for a lightweight one. */
export function assertAnnotatedTagType(objectType, tag) {
  if (objectType !== "tag") {
    throw new Error(
      `Tag ${tag} must be an annotated tag (git tag -a). git cat-file -t returned ${JSON.stringify(objectType)}.`,
    );
  }
}

/**
 * A release is cut only when this commit changed the library version and npm
 * does not already have it. An unchanged version (including the current 2.3.2,
 * which is newer than the published 2.3.1) is not tagged or published, and
 * versions already on npm are not backfilled with tags.
 */
export function releaseDecision({ previousVersion, currentVersion, published }) {
  if (typeof previousVersion !== "string" || previousVersion.length === 0) {
    return {
      action: "error",
      reason:
        "Cannot read the parent commit's package version. Refusing to tag or publish.",
    };
  }
  if (previousVersion === currentVersion) {
    return {
      action: "skip",
      reason: `Version is still ${currentVersion}, so this push is not a version bump. Not tagging or publishing.`,
    };
  }
  if (published) {
    return {
      action: "skip",
      reason: `${currentVersion} is already on npm. Existing releases are not backfilled with tags.`,
    };
  }
  return {
    action: "release",
    tag: releaseTagFor(currentVersion),
    reason: `Version changed from ${previousVersion} to ${currentVersion} and is not on npm.`,
  };
}

export function npmDistTag(version) {
  const dash = version.indexOf("-");
  if (dash === -1) return "latest";
  const id = version.slice(dash + 1).split(".")[0];
  if (!/^[0-9A-Za-z-]+$/.test(id)) {
    throw new Error(`Cannot derive an npm dist-tag from version ${version}.`);
  }
  return id;
}

export function interpretNpmView(status, stdout, stderr) {
  if (status === 0 && stdout.trim().length > 0) {
    return { published: true, version: stdout.trim() };
  }
  const text = `${stdout}\n${stderr}`;
  if (status !== 0 && /\bE404\b/.test(text)) {
    return { published: false };
  }
  return {
    published: false,
    error: text.trim() || `npm view failed with status ${status}`,
  };
}

export function changelogSection(markdown, version) {
  const lines = markdown.split(/\r?\n/);
  const heading = `## ${version}`;
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+\d+\.\d+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  const section = lines.slice(start, end).join("\n").trim();
  return section.length > 0 ? section : null;
}

export function notesForRelease({ changelog, version }) {
  const section = changelogSection(changelog, version);
  if (!section) return null;
  return `${section}\n`;
}
