import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const corexPkg = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../../packages/corex-ui/package.json", import.meta.url)),
    "utf-8",
  ),
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __COREX_UI_VERSION__: JSON.stringify(corexPkg.version),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@xco-agency/corex-ui": fileURLToPath(
        new URL("../../packages/corex-ui/src", import.meta.url),
      ),
    },
  },
});

