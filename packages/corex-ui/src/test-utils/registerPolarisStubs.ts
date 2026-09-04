/**
 * jsdom does not load the real Polaris web components (they only exist once
 * `polaris-1.js` runs in an actual browser). These minimal custom-element
 * stand-ins exist purely so unit tests can render our wrappers and assert on
 * the props/attributes/events our `core` layer sets on the underlying
 * element, without needing a real browser. Never shipped in `dist`.
 */

function defineStub(tagName: string, ElementClass: CustomElementConstructor) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ElementClass);
  }
}

class GenericPolarisStub extends HTMLElement {}

/** `s-modal` supports imperative `showOverlay()` / `hideOverlay()`, mirrored here. */
class ModalStub extends HTMLElement {
  showOverlay() {
    this.setAttribute("data-stub-open", "true");
  }

  hideOverlay() {
    this.removeAttribute("data-stub-open");
    this.dispatchEvent(new Event("hide", { bubbles: true }));
  }
}

/** `s-app-window` supports imperative `show()` / `hide()`, per Shopify's own examples. */
class AppWindowStub extends HTMLElement {
  show() {
    this.setAttribute("data-stub-open", "true");
  }

  hide() {
    this.removeAttribute("data-stub-open");
  }
}

const STUB_TAGS = [
  "s-button",
  "s-button-group",
  "s-text",
  "s-heading",
  "s-badge",
  "s-banner",
  "s-box",
  "s-stack",
  "s-section",
  "s-text-field",
  "s-text-area",
  "s-select",
  "s-option",
  "s-checkbox",
  "s-spinner",
  "s-page",
  "s-link",
  "s-icon",
  "s-divider",
  "s-avatar",
  "s-thumbnail",
  "s-tooltip",
  "s-choice-list",
  "s-choice",
  "s-date-field",
  "s-date-picker",
  "s-menu",
  "s-app-nav",
  "s-clickable",
  "ui-save-bar",
];

export function registerPolarisStubs() {
  for (const tag of STUB_TAGS) {
    defineStub(tag, class extends GenericPolarisStub {});
  }
  defineStub("s-modal", ModalStub);
  defineStub("s-app-window", AppWindowStub);
}
