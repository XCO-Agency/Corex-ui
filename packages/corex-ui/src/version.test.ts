import { readFileSync } from "node:fs";
// Aliased on purpose: an import named `URL` is shadowed by jsdom's global URL under
// the test environment, which resolves against http://localhost and makes
// fileURLToPath throw. Keep the alias.
import { fileURLToPath, URL as NodeURL } from "node:url";

import { COREX_UI_VERSION, version } from "./version";

/** The version npm actually publishes. */
function publishedVersion(): string {
  const packageJson = JSON.parse(
    readFileSync(fileURLToPath(new NodeURL("../package.json", import.meta.url)), "utf-8"),
  ) as { version: string };

  return packageJson.version;
}

describe("COREX_UI_VERSION", () => {
  it("matches the version in package.json", () => {
    expect(COREX_UI_VERSION).toBe(publishedVersion());
  });

  it("is exposed unchanged through the `version` alias", () => {
    expect(version).toBe(publishedVersion());
  });

  it("is a bare semver string, with no leading `v` or range prefix", () => {
    expect(COREX_UI_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
