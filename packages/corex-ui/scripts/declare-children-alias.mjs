import { readFileSync, writeFileSync } from "node:fs";

/**
 * tsup's declaration bundle renames Polaris's `ComponentChildren` to
 * `ComponentChildren$1` and then drops the alias. Apps that typecheck this
 * package fail with "Cannot find name 'ComponentChildren$1'".
 */
for (const file of ["dist/index.d.ts", "dist/index.d.cts"]) {
  const text = readFileSync(file, "utf8");
  if (!text.includes("ComponentChildren$1") || /^\s*type ComponentChildren\$1\b/m.test(text)) {
    continue;
  }
  writeFileSync(file, `type ComponentChildren$1 = any;\n${text}`);
}
