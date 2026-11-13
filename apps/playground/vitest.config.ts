import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

/** Unit tests for the copy-in blocks (src/blocks/**). The app itself is QA'd by hand. */
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/blocks/**/*.test.{ts,tsx}"],
  },
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@xco-agency/corex-ui": fileURLToPath(
        new URL("../../packages/corex-ui/src", import.meta.url),
      ),
    },
  },
});
