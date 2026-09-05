import { useMemo } from "react";
import { devWarning } from "../utils/devWarning";
import type { ShopifyToastOptions } from "../types/app-bridge";

export interface UseToastResult {
  show(message: string, options?: ShopifyToastOptions): void;
}

/**
 * App Bridge hook-bridge pattern (see `docs/architecture.md`): wraps the
 * imperative `window.shopify.toast.show(...)` global API in a React hook.
 * `window.shopify` only exists inside a real embedded Shopify admin
 * session — outside one (including this repo's own playground), calls
 * no-op with a dev-mode warning instead of throwing.
 */
export function useToast(): UseToastResult {
  return useMemo(
    () => ({
      show(message: string, options?: ShopifyToastOptions) {
        const shopify = typeof window !== "undefined" ? (window.shopify as any) : undefined;
        if (shopify?.toast) {
          shopify.toast.show(message, options);
          return;
        }
        devWarning(
          "useToast",
          "window.shopify is not available — toasts only work inside a real embedded Shopify admin session.",
        );
      },
    }),
    [],
  );
}
