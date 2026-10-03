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

/** `s-popover` supports imperative `showOverlay()` / `hideOverlay()` and `hide()`. */
class PopoverStub extends HTMLElement {
  showOverlay() {
    this.setAttribute("data-stub-open", "true");
  }

  hideOverlay() {
    this.removeAttribute("data-stub-open");
    this.dispatchEvent(new Event("hide", { bubbles: true }));
  }

  toggleOverlay() {
    if (this.hasAttribute("data-stub-open")) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }

  showPopover() {
    this.showOverlay();
  }

  hidePopover() {
    this.hideOverlay();
  }

  togglePopover(_options?: any): boolean {
    this.toggleOverlay();
    return this.hasAttribute("data-stub-open");
  }

  hide() {
    this.removeAttribute("data-stub-open");
    this.dispatchEvent(new Event("hide", { bubbles: true }));
  }
}

class ChoiceListStub extends HTMLElement {
  values: string[] = [];
}

class ChoiceStub extends HTMLElement {
  connectedCallback() {
    this.addEventListener("click", () => {
      const list = this.closest("s-choice-list") as
        (ChoiceListStub & { multiple?: boolean }) | null;
      if (!list) return;
      const val = this.getAttribute("value") || "";
      const multipleAttr = list.getAttribute("multiple");
      const isMultiple =
        typeof (list as any).multiple === "boolean"
          ? (list as any).multiple
          : multipleAttr !== null && multipleAttr !== "false";
      let currentValues = Array.isArray(list.values) ? [...list.values] : [];
      if (isMultiple) {
        if (currentValues.includes(val)) {
          currentValues = currentValues.filter((v) => v !== val);
        } else {
          currentValues.push(val);
        }
      } else {
        currentValues = [val];
      }
      list.values = currentValues;
      list.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
}

const STUB_TAGS = [
  "s-button",
  "s-button-group",
  "s-text",
  "s-paragraph",
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
  "s-image",
  "s-search-field",
  "s-tooltip",
  "s-date-field",
  "s-money-field",
  "s-color-field",
  "s-drop-zone",
  "s-email-field",
  "s-number-field",
  "s-password-field",
  "s-url-field",
  "s-menu",
  "s-app-nav",
  "s-clickable",
  "s-chip",
  "s-scroll-box",
  "s-unordered-list",
  "s-ordered-list",
  "s-list-item",
  "s-grid",
  "s-grid-item",
  "ui-save-bar",
  "ui-title-bar",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

class DatePickerStub extends HTMLElement {
  static get observedAttributes() {
    return [
      "type",
      "visiblemonths",
      "view",
      "value",
      "defaultview",
      "defaultvalue",
      "name",
    ];
  }

  get value() {
    return this.getAttribute("value") || "";
  }
  set value(val: string) {
    this.setAttribute("value", val);
  }

  get view() {
    return this.getAttribute("view") || "";
  }
  set view(val: string) {
    this.setAttribute("view", val);
  }

  get visibleMonths() {
    return this.getAttribute("visiblemonths") || "1";
  }
  set visibleMonths(val: string) {
    this.setAttribute("visiblemonths", String(val));
  }

  connectedCallback() {
    this.renderMonthLabels();
  }

  attributeChangedCallback() {
    this.renderMonthLabels();
  }

  private renderMonthLabels() {
    const view =
      this.getAttribute("view") ||
      this.getAttribute("defaultview") ||
      this.getAttribute("value")?.slice(0, 7) ||
      "";
    const visibleMonths = this.getAttribute("visiblemonths") || "1";

    let year: number;
    let month: number;
    if (view && view.includes("-")) {
      const parts = view.split("-");
      year = parseInt(parts[0] ?? "", 10);
      month = parseInt(parts[1] ?? "", 10) - 1;
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
    }

    this.innerHTML = "";
    const m1Text = `${MONTH_NAMES[month]} ${year}`;
    const span1 = document.createElement("span");
    span1.textContent = m1Text;
    this.appendChild(span1);

    if (visibleMonths === "2") {
      const nextDate = new Date(year, month + 1, 1);
      const m2Text = `${MONTH_NAMES[nextDate.getMonth()]} ${nextDate.getFullYear()}`;
      const span2 = document.createElement("span");
      span2.textContent = m2Text;
      this.appendChild(span2);
    }
  }
}

/** `ui-modal` supports imperative `show()` / `hide()` and dispatches `hide` events. */
class UiModalStub extends HTMLElement {
  show() {
    this.setAttribute("data-stub-open", "true");
  }

  hide() {
    this.removeAttribute("data-stub-open");
    this.dispatchEvent(new Event("hide", { bubbles: true }));
  }

  hideOverlay() {
    this.removeAttribute("data-stub-open");
    this.dispatchEvent(new Event("hide", { bubbles: true }));
  }
}

export function registerPolarisStubs() {
  for (const tag of STUB_TAGS) {
    defineStub(tag, class extends GenericPolarisStub {});
  }
  defineStub("s-modal", ModalStub);
  defineStub("s-app-window", AppWindowStub);
  defineStub("s-popover", PopoverStub);
  defineStub("s-choice-list", ChoiceListStub);
  defineStub("s-choice", ChoiceStub);
  defineStub("s-date-picker", DatePickerStub);
  defineStub("ui-modal", UiModalStub);
}
