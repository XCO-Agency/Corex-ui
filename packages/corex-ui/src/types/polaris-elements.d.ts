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

export interface SMoneyFieldElement extends HTMLElement {
  value?: string;
  defaultValue?: string;
  currencyCode?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  details?: string;
  label?: string;
  placeholder?: string;
}

export interface SColorFieldElement extends HTMLElement {
  value?: string;
  defaultValue?: string;
  alpha?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  details?: string;
  label?: string;
  placeholder?: string;
}

export interface SDropZoneElement extends HTMLElement {
  accept?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  labelAccessibilityVisibility?: "visible" | "exclusive";
  multiple?: boolean;
  name?: string;
  required?: boolean;
  value?: string;
  files?: File[];
}

export interface SEmailFieldElement extends HTMLElement {
  value?: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  details?: string;
  label?: string;
  placeholder?: string;
  autocomplete?: string;
}

export interface SNumberFieldElement extends HTMLElement {
  value?: string;
  defaultValue?: string;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: "decimal" | "numeric";
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  details?: string;
  label?: string;
  placeholder?: string;
  autocomplete?: string;
}

export interface SPasswordFieldElement extends HTMLElement {
  value?: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  details?: string;
  label?: string;
  placeholder?: string;
  autocomplete?: string;
}

export interface SUrlFieldElement extends HTMLElement {
  value?: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  details?: string;
  label?: string;
  placeholder?: string;
  autocomplete?: string;
}

declare global {
  interface HTMLElementTagNameMap {
    "s-modal": SModalElement;
    "s-money-field": SMoneyFieldElement;
    "s-color-field": SColorFieldElement;
    "s-drop-zone": SDropZoneElement;
    "s-email-field": SEmailFieldElement;
    "s-number-field": SNumberFieldElement;
    "s-password-field": SPasswordFieldElement;
    "s-url-field": SUrlFieldElement;
  }

  namespace JSX {
    interface IntrinsicElements {
      "s-money-field": any;
      "s-color-field": any;
      "s-drop-zone": any;
      "s-email-field": any;
      "s-number-field": any;
      "s-password-field": any;
      "s-url-field": any;
    }
  }
}

export {};
