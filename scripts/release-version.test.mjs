import assert from "node:assert/strict";
import test from "node:test";

import {
  assertAnnotatedTagType,
  assertReleaseTag,
  assertVersionsInSync,
  changelogSection,
  interpretNpmView,
  isReleaseTag,
  npmDistTag,
  notesForRelease,
  readVersions,
  releaseDecision,
  releaseTagFor,
  replaceVersionField,
} from "./release-version.mjs";

const versions = {
  name: "@xco-agency/corex-ui",
  package: "2.3.2",
  root: "2.3.2",
};

test("workspace package.json versions stay in sync", () => {
  const actual = readVersions();
  assert.equal(actual.name, "@xco-agency/corex-ui");
  assert.equal(actual.package, actual.root);
});

test("replaceVersionField updates only the version string", () => {
  const raw = '{\n  "name": "corex-ui-workspace",\n  "version": "2.3.2"\n}\n';
  const next = replaceVersionField(raw, "2.3.3");
  assert.match(next, /"version": "2.3.3"/);
  assert.equal(replaceVersionField(next, "2.3.3"), next);
});

test("release tags must be annotated", () => {
  assert.doesNotThrow(() => assertAnnotatedTagType("tag", "v2.3.2"));
  assert.throws(() => assertAnnotatedTagType("commit", "v2.3.2"), /annotated tag/);
});

test("release tags are v plus the package.json version", () => {
  assert.equal(releaseTagFor("2.3.2"), "v2.3.2");
  assert.equal(isReleaseTag("v2.3.2"), true);
  assert.equal(isReleaseTag("v2.4.0-beta.1"), true);
  assert.equal(isReleaseTag("2.3.2"), false);
  assert.equal(isReleaseTag("@xco-agency/corex-ui@2.3.2"), false);
  assert.equal(isReleaseTag("v0.0.1"), true);
  assertReleaseTag("v2.3.2", versions);
  assert.throws(() => assertReleaseTag("v2.3.1", versions), /does not match/);
  assert.throws(() => assertReleaseTag("main", versions), /not a SemVer release tag/);
});

test("root and package versions must match before a tag is accepted", () => {
  assert.throws(
    () => assertVersionsInSync({ ...versions, root: "2.3.1" }),
    /does not match/,
  );
});

test("unchanged versions are not released, even when npm does not have them", () => {
  const decision = releaseDecision({
    previousVersion: "2.3.2",
    currentVersion: "2.3.2",
    published: false,
  });
  assert.equal(decision.action, "skip");
});

test("versions already on npm are not backfilled with tags", () => {
  const decision = releaseDecision({
    previousVersion: "2.3.1",
    currentVersion: "2.3.2",
    published: true,
  });
  assert.equal(decision.action, "skip");
});

test("a version bump that is not on npm is released as vX.Y.Z", () => {
  const decision = releaseDecision({
    previousVersion: "2.3.2",
    currentVersion: "2.3.3",
    published: false,
  });
  assert.equal(decision.action, "release");
  assert.equal(decision.tag, "v2.3.3");
});

test("a missing parent version fails closed", () => {
  const decision = releaseDecision({
    previousVersion: "",
    currentVersion: "2.3.3",
    published: false,
  });
  assert.equal(decision.action, "error");
});

test("npm view distinguishes a published version from a 404 and a hard failure", () => {
  assert.equal(interpretNpmView(0, "2.3.1\n", "").published, true);
  assert.equal(
    interpretNpmView(
      1,
      "",
      "npm error code E404\nnpm error 404 No match found for version 2.3.2\n",
    ).published,
    false,
  );
  assert.equal(
    interpretNpmView(1, "", "npm error network timeout").error.includes("timeout"),
    true,
  );
});

test("prerelease versions use their identifier as the npm dist-tag", () => {
  assert.equal(npmDistTag("2.3.3"), "latest");
  assert.equal(npmDistTag("2.4.0-beta.1"), "beta");
  assert.equal(npmDistTag("2.4.0-rc.2"), "rc");
});

test("changelog notes are the matching version section", () => {
  const markdown =
    "# @xco-agency/corex-ui\n\n## 2.3.3\n\n### Patch Changes\n\n- Fix the button.\n\n## 2.3.2\n\n### Patch Changes\n\n- Older.\n";
  assert.match(changelogSection(markdown, "2.3.3"), /Fix the button/);
  assert.doesNotMatch(changelogSection(markdown, "2.3.3"), /Older/);
  assert.equal(changelogSection(markdown, "9.9.9"), null);
  assert.match(notesForRelease({ changelog: markdown, version: "2.3.2" }), /Older/);
});
