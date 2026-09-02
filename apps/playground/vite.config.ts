import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@xco/corex-ui": fileURLToPath(new URL("../../packages/corex-ui/src", import.meta.url)),
    },
  },
});
