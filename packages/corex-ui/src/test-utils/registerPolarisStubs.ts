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

/** `s-modal` supports imperative `show()` / `hideOverlay()`, mirrored here. */
class ModalStub extends HTMLElement {
  show() {
    this.setAttribute("data-stub-open", "true");
  }

  hideOverlay() {
    this.removeAttribute("data-stub-open");
    this.dispatchEvent(new Event("close", { bubbles: true }));
  }
}

const STUB_TAGS = [
  "s-button",
  "s-button-group",
  "s-text",
  "s-badge",
  "s-banner",
  "s-box",
  "s-stack",
  "s-section",
  "s-text-field",
  "s-select",
  "s-checkbox",
  "s-spinner",
  "s-page",
];

export function registerPolarisStubs() {
  for (const tag of STUB_TAGS) {
    defineStub(tag, class extends GenericPolarisStub {});
  }
  defineStub("s-modal", ModalStub);
}
