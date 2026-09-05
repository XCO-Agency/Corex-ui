import { useMemo } from "react";
import { devWarning } from "../utils/devWarning";

export interface UseSaveBarResult {
  show(id?: string): void;
  hide(id?: string): void;
}

/**
 * App Bridge hook-bridge pattern (see `docs/architecture.md`): wraps
 * `window.shopify.saveBar.show(id)` / `.hide(id)`. Pair with a `SaveBar`
 * (`<ui-save-bar>`) of the same `id` — see `docs/app-bridge.md`. No-ops with
 * a dev-mode warning when `window.shopify` isn't available.
 */
export function useSaveBar(): UseSaveBarResult {
  return useMemo(
    () => ({
      show(id?: string) {
        const shopify = typeof window !== "undefined" ? (window.shopify as any) : undefined;
        if (shopify?.saveBar) {
          shopify.saveBar.show(id);
          return;
        }
        devWarning(
          "useSaveBar",
          "window.shopify is not available — the save bar only works inside a real embedded Shopify admin session.",
        );
      },
      hide(id?: string) {
        const shopify = typeof window !== "undefined" ? (window.shopify as any) : undefined;
        if (shopify?.saveBar) {
          shopify.saveBar.hide(id);
          return;
        }
        devWarning(
          "useSaveBar",
          "window.shopify is not available — the save bar only works inside a real embedded Shopify admin session.",
        );
      },
    }),
    [],
  );
}
