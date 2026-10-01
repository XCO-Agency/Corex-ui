import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { createWebComponent } from "./createWebComponent";

const SProbe = createWebComponent<HTMLElement>("s-probe");

/**
 * HTML attribute names are case-insensitive, so a camelCase prop written as an
 * attribute lands as its all-lowercase spelling (`accessibilityLabel` ->
 * `accessibilitylabel`). That spelling means nothing to a Polaris custom
 * element: only the kebab-case one is read. Emitting both inflated every SSR
 * payload and risked hydration mismatches, so the factory must emit exactly one
 * attribute per prop.
 */
describe("createWebComponent", () => {
  it("emits a camelCase prop as its kebab-case attribute only", () => {
    const { container } = render(
      <SProbe accessibilityLabel="Resume" autoComplete="off" />,
    );
    const el = container.querySelector("s-probe")!;

    expect(el).toHaveAttribute("accessibility-label", "Resume");
    expect(el).toHaveAttribute("auto-complete", "off");
    expect(el).not.toHaveAttribute("accessibilitylabel");
    expect(el).not.toHaveAttribute("autocomplete");
  });

  it("never carries both the kebab-case and camelCase spelling of a prop", () => {
    const { container } = render(
      <SProbe
        accessibilityLabel="Resume"
        labelAccessibilityVisibility="exclusive"
        inlineSize="fill"
        maxBlockSize="300px"
      />,
    );

    for (const el of container.querySelectorAll("*")) {
      const names = el.getAttributeNames();
      for (const name of names) {
        if (!name.includes("-")) continue;
        const collapsed = name.replace(/-/g, "");
        expect(names).not.toContain(collapsed);
      }
    }
  });

  it("leaves already-kebab-case and lowercase props untouched", () => {
    const { container } = render(<SProbe variant="primary" aria-hidden="true" />);
    const el = container.querySelector("s-probe")!;

    expect(el).toHaveAttribute("variant", "primary");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("maps className to class and the invoker props to their lowercase attributes", () => {
    const { container } = render(
      <SProbe className="probe" commandFor="target" interestFor="hint" />,
    );
    const el = container.querySelector("s-probe")!;

    expect(el).toHaveAttribute("class", "probe");
    expect(el).toHaveAttribute("commandfor", "target");
    expect(el).toHaveAttribute("interestfor", "hint");
    expect(el).not.toHaveAttribute("classname");
  });
});
