import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import pkg from "../package.json";

/*
 * The library ships nothing but React and the Polaris web components it
 * wraps. Third-party runtimes leak into host apps: Base UI, for one, pulls
 * `use-sync-external-store/shim`, which broke a storefront's cart preview.
 */

// Type-only packages (Polaris / App Bridge element and global typings).
const ALLOWED_DEPENDENCIES = ["@shopify/app-bridge-types", "@shopify/polaris-types"];
const ALLOWED_PEERS = ["react", "react-dom"];
// Runtime imports allowed in library source (the CLI also uses Node built-ins).
const ALLOWED_IMPORT = /^(react|react-dom)(\/.*)?$|^node:/;

const SRC = __dirname;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "test-utils" ? [] : sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.(test|d)\.tsx?$/.test(name) ? [path] : [];
  });
}

function bareImports(code: string): string[] {
  const specifiers = new Set<string>();
  // Static `import … from "x"`, side-effect `import "x"`, `export … from "x"` and `import("x")`.
  const pattern = /(?:^|\n)\s*(?:import|export)\s[^"'`]*?from\s*["']([^"']+)["']|(?:^|\n)\s*import\s*["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of code.matchAll(pattern)) {
    const specifier = match[1] ?? match[2] ?? match[3];
    if (specifier && !specifier.startsWith(".")) specifiers.add(specifier);
  }
  return [...specifiers];
}

describe("package dependencies", () => {
  it("declares only type packages as dependencies and React as peers", () => {
    const { dependencies = {}, peerDependencies = {} } = pkg as {
      dependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    expect(Object.keys(dependencies).sort()).toEqual([...ALLOWED_DEPENDENCIES].sort());
    expect(Object.keys(peerDependencies).sort()).toEqual([...ALLOWED_PEERS].sort());
  });

  it("imports nothing at runtime except React (and Node built-ins in the CLI)", () => {
    const offenders = sourceFiles(SRC).flatMap((file) =>
      bareImports(readFileSync(file, "utf8"))
        .filter((specifier) => !ALLOWED_IMPORT.test(specifier))
        .map((specifier) => `${file.slice(SRC.length + 1)} → ${specifier}`),
    );
    expect(offenders).toEqual([]);
  });
});
