import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { buildRegistry } from "./scripts/build-registry.mjs";

const corexPkg = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../../packages/corex-ui/package.json", import.meta.url)),
    "utf-8",
  ),
);

function registryWatcherPlugin(): Plugin {
  return {
    name: "corex-registry-watcher",
    configureServer(server) {
      // Rebuild on dev server startup to ensure public/r is up-to-date
      try {
        buildRegistry({ silent: true });
      } catch (err) {
        console.error("[registry-watcher] Initial build failed:", err);
      }

      const blocksDir = fileURLToPath(new URL("./src/blocks", import.meta.url));
      server.watcher.add(blocksDir);

      let debounceTimer: ReturnType<typeof setTimeout> | undefined;
      const onChange = (filePath: string) => {
        if (filePath.includes("/src/blocks/") || filePath.includes("\\src\\blocks\\")) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            try {
              buildRegistry({ silent: true });
            } catch (err) {
              console.error("[registry-watcher] Auto-sync failed:", err);
            }
          }, 150);
        }
      };

      server.watcher.on("add", onChange);
      server.watcher.on("change", onChange);
      server.watcher.on("unlink", onChange);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), registryWatcherPlugin()],
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


