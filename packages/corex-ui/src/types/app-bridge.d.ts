// Ambient types for Shopify App Bridge's window/navigation/toast/save-bar
// layer, which is a distinct subsystem from the Polaris design components in
// `polaris-elements.d.ts` — `s-app-window`, `s-app-nav`, `s-menu`, and the
// non-`s-`-prefixed `<ui-save-bar>` element, plus the imperative
// `window.shopify.toast`/`window.shopify.saveBar` global API. See
// `docs/app-bridge.md`.
//
// The official source of truth is `@shopify/app-bridge-types` (kept as a
// devDependency, versioned to match the `app-bridge.js` CDN script your app
// loads). We reference it here so contributors and consumers get IntelliSense
// against the full official Shopify App Bridge API.

/// <reference types="@shopify/app-bridge-types" />

import type {
  ShopifyGlobal as AppBridgeShopifyGlobal,
  ToastOptions as AppBridgeToastOptions,
} from "@shopify/app-bridge-types";

export type ShopifyGlobal = AppBridgeShopifyGlobal;
export type ShopifyToastOptions = AppBridgeToastOptions;

/** `s-app-window`'s imperative API, per Shopify's own usage examples (`el.show()` / `el.hide()`). */
export interface SAppWindowElement extends HTMLElement {
  show(): void;
  hide(): void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "s-app-nav": import("react").DetailedHTMLProps<
        import("react").HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "s-app-window": import("react").DetailedHTMLProps<
        import("react").HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
      };
    }
  }

  interface Window {
    shopify?: ShopifyGlobal;
  }

  interface HTMLElementTagNameMap {
    "s-app-window": SAppWindowElement;
    "s-app-nav": HTMLElement;
  }
}
