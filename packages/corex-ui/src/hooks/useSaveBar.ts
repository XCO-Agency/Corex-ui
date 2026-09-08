import { useMemo } from "react";
import { devWarning } from "../utils/devWarning";

export interface UseSaveBarResult {
  show(id?: string): Promise<void> | void;
  hide(id?: string): Promise<void> | void;
  toggle(id?: string): Promise<void> | void;
  leaveConfirmation(): Promise<void>;
}

export type UseSaveBarResultType = UseSaveBarResult;

/**
 * App Bridge hook-bridge pattern (see `docs/architecture.md`): wraps
 * `window.shopify.saveBar.show(id)` / `.hide(id)` / `.toggle(id)` / `.leaveConfirmation()`.
 * Pair with a `SaveBar` (`<ui-save-bar>`) of the same `id` — see `docs/app-bridge.md`.
 * No-ops with a dev-mode warning when `window.shopify` isn't available.
 */
export function useSaveBar(): UseSaveBarResult {
  return useMemo(
    () => ({
      show(id: string = "corex-ui-save-bar") {
        const shopify =
          typeof window !== "undefined" ? (window.shopify as any) : undefined;
        if (shopify?.saveBar?.show) {
          return shopify.saveBar.show(id);
        }
        devWarning(
          "useSaveBar",
          "window.shopify is not available — the save bar only works inside a real embedded Shopify admin session.",
        );
      },
      hide(id: string = "corex-ui-save-bar") {
        const shopify =
          typeof window !== "undefined" ? (window.shopify as any) : undefined;
        if (shopify?.saveBar?.hide) {
          return shopify.saveBar.hide(id);
        }
        devWarning(
          "useSaveBar",
          "window.shopify is not available — the save bar only works inside a real embedded Shopify admin session.",
        );
      },
      toggle(id: string = "corex-ui-save-bar") {
        const shopify =
          typeof window !== "undefined" ? (window.shopify as any) : undefined;
        if (shopify?.saveBar?.toggle) {
          return shopify.saveBar.toggle(id);
        }
        devWarning(
          "useSaveBar",
          "window.shopify is not available — the save bar only works inside a real embedded Shopify admin session.",
        );
      },
      leaveConfirmation() {
        const shopify =
          typeof window !== "undefined" ? (window.shopify as any) : undefined;
        if (shopify?.saveBar?.leaveConfirmation) {
          return shopify.saveBar.leaveConfirmation();
        }
        return Promise.resolve();
      },
    }),
    [],
  );
}
