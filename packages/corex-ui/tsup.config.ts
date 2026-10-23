import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    external: [
      "react",
      "react-dom",
      "cmdk",
      "@base-ui/react",
      /^@base-ui\/react\//,
      /^@base-ui\/utils/,
    ],
  },
  {
    entry: { cli: "src/cli/index.ts" },
    format: ["esm"],
    dts: false,
    sourcemap: false,
    banner: {
      js: "#!/usr/bin/env node",
    },
    clean: false,
  },
]);
