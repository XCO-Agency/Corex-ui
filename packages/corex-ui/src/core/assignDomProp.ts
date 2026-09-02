/**
 * Assigns a single prop onto a custom element as a live DOM *property*
 * (`el[key] = value`), never an attribute.
 *
 * This is only ever called for prop names a component wrapper explicitly
 * listed in `createWebComponent`'s `domProps` option — the wrapper has
 * already decided the value is non-primitive (objects/arrays) or must stay
 * a live, controlled property (e.g. `TextField`/`Select`'s `value`,
 * `Checkbox`'s `checked`, `ChoiceList`'s `choices`/`selected`), so there is
 * no ambiguity left to resolve here the way plain JSX attribute passthrough
 * has to. This mirrors how native `<input>` distinguishes its live `.value`
 * property from the initial, attribute-driven default.
 */
export function assignDomProp(el: Element, key: string, value: unknown): void {
  if (value === undefined) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any)[key] = value;
}
