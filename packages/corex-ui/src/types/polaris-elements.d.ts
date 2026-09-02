// Ambient types for the Polaris `s-*` custom elements consumed by `core/`.
//
// The official source of truth is `@shopify/polaris-types` (kept as a
// devDependency, versioned to match the `polaris-1.js` CDN script your app
// loads). We reference it here so contributors working inside this package
// get IntelliSense against the real element APIs.
//
// The fallback declarations below only cover the handful of DOM properties
// and methods our own `components/*` wrappers touch directly (e.g. Modal's
// `show`/`hideOverlay`). They exist so this package still type-checks for
// consumers who haven't installed `@shopify/polaris-types`, and are
// intentionally minimal — they are not a full typing of Polaris.

/// <reference types="@shopify/polaris-types" />

export interface SModalElement extends HTMLElement {
  showOverlay(): void;
  hideOverlay(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "s-modal": SModalElement;
  }
}

export {};
