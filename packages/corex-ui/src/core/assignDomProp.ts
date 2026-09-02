/**
 * Assigns a single prop onto a custom element following Shopify's documented
 * property/attribute rule: if the property already exists on the element
 * (i.e. the custom element class defines it), set it as a DOM property so
 * non-primitive values (objects, arrays, functions) pass through untouched.
 * Otherwise fall back to standard attribute get/set/remove semantics.
 *
 * `value` and `checked` are excluded from the "prefer property" shortcut
 * because they follow native HTML input semantics (attribute = default,
 * property = live value), matching how the real Polaris elements behave.
 */
export function assignDomProp(el: Element, key: string, value: unknown): void {
  if (value === undefined) {
    return;
  }

  // `value`/`checked` always go through the property (never the attribute)
  // so controlled components stay in sync on every render, mirroring how
  // native `<input>` distinguishes the live property from the initial
  // attribute-driven default.
  const alwaysUsesProperty = key === "value" || key === "checked";

  if (alwaysUsesProperty || key in el) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)[key] = value;
    return;
  }

  if (value === false || value === null) {
    el.removeAttribute(key);
    return;
  }

  if (value === true) {
    el.setAttribute(key, "");
    return;
  }

  el.setAttribute(key, String(value));
}
