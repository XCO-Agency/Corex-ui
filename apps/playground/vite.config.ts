import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@xco-agency/corex-ui": fileURLToPath(
        new URL("../../packages/corex-ui/src", import.meta.url),
      ),
      "@xco/corex-ui": fileURLToPath(
        new URL("../../packages/corex-ui/src", import.meta.url),
      ),
    },
  },
});
