import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { createWebComponent } from "./createWebComponent";

const SProbe = createWebComponent<HTMLElement>("s-probe");

/**
 * Polaris custom elements read the all-lowercase collapse of a camelCase prop
 * (`accessibilityLabel` -> `accessibilitylabel`), the name the HTML parser
 * produces for `<s-button accessibilityLabel>`. The kebab-case spelling
 * (`accessibility-label`) is ignored by them. The factory must emit exactly
 * one attribute per prop, and it must be the lowercase one.
 */
describe("createWebComponent", () => {
  it("emits a camelCase prop as its lowercase attribute only", () => {
    const { container } = render(
      <SProbe accessibilityLabel="Resume" autoComplete="off" />,
    );
    const el = container.querySelector("s-probe")!;

    expect(el).toHaveAttribute("accessibilitylabel", "Resume");
    expect(el).toHaveAttribute("autocomplete", "off");
    expect(el).not.toHaveAttribute("accessibility-label");
    expect(el).not.toHaveAttribute("auto-complete");
  });

  it("never emits a kebab-case attribute for a camelCase prop", () => {
    const { container } = render(
      <SProbe
        accessibilityLabel="Resume"
        labelAccessibilityVisibility="exclusive"
        inlineSize="fill"
        maxBlockSize="300px"
      />,
    );

    const el = container.querySelector("s-probe")!;
    expect(el.getAttributeNames().sort()).toEqual([
      "accessibilitylabel",
      "inlinesize",
      "labelaccessibilityvisibility",
      "maxblocksize",
    ]);
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

  it("writes global HTML attributes in their lowercase form, not kebab-case", () => {
    const { container } = render(<SProbe tabIndex={0} spellCheck={false} />);
    const el = container.querySelector("s-probe")!;

    expect(el).toHaveAttribute("tabindex", "0");
    expect(el).toHaveAttribute("spellcheck", "false");
    expect(el).not.toHaveAttribute("tab-index");
    expect(el).not.toHaveAttribute("spell-check");
  });

  it("omits a false boolean and writes true as the empty attribute", () => {
    // Polaris parses any present attribute, "false" included, as true.
    const { container, rerender } = render(<SProbe disabled={false} loading />);
    const el = container.querySelector("s-probe")!;

    expect(el).not.toHaveAttribute("disabled");
    expect(el).toHaveAttribute("loading", "true");

    rerender(<SProbe disabled loading={false} />);
    expect(el).toHaveAttribute("disabled", "true");
    expect(el).not.toHaveAttribute("loading");
  });

  it("keeps a false value where the attribute is enumerated", () => {
    const { container } = render(
      <SProbe spellCheck={false} aria-expanded={false} data-open={false} />,
    );
    const el = container.querySelector("s-probe")!;

    expect(el).toHaveAttribute("spellcheck", "false");
    expect(el).toHaveAttribute("aria-expanded", "false");
    expect(el).toHaveAttribute("data-open", "false");
  });

  it("hands on* props that are not in `events` to React's event system", () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const { container } = render(<SProbe onClick={onClick} onKeyDown={onKeyDown} />);
    const el = container.querySelector("s-probe")!;

    fireEvent.click(el);
    fireEvent.keyDown(el, { key: "Enter" });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(el).not.toHaveAttribute("onclick");
  });

  it("binds a mapped event once, as a native listener", () => {
    const SMapped = createWebComponent<HTMLElement, { onClick: "click" }>("s-mapped", {
      events: { onClick: "click" },
    });
    const onClick = vi.fn();
    const { container } = render(<SMapped onClick={onClick} />);

    fireEvent.click(container.querySelector("s-mapped")!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("lets static attributes win over a prop of the same name, on every render", () => {
    const SStatic = createWebComponent<HTMLElement>("s-static", {
      staticAttributes: { direction: "inline" },
    });
    const { container, rerender } = render(<SStatic direction="block" />);
    const el = container.querySelector("s-static")!;

    expect(el).toHaveAttribute("direction", "inline");
    rerender(<SStatic direction="block-end" />);
    expect(el).toHaveAttribute("direction", "inline");
  });

  it("passes React-reserved props through untouched", () => {
    const { container } = render(
      <SProbe style={{ color: "red" }} dangerouslySetInnerHTML={{ __html: "<b>hi</b>" }} />,
    );
    const el = container.querySelector("s-probe")!;

    expect(el).toHaveStyle({ color: "rgb(255, 0, 0)" });
    expect(el.innerHTML).toBe("<b>hi</b>");
    expect(el).not.toHaveAttribute("dangerouslysetinnerhtml");
  });

  it("assigns object domProps as properties, never as attributes", () => {
    const SList = createWebComponent<HTMLElement>("s-list", { domProps: ["items"] });
    const items = [{ id: 1 }];
    const { container } = render(<SList items={items} />);
    const el = container.querySelector("s-list") as HTMLElement & { items?: unknown };

    expect(el.items).toBe(items);
    expect(el).not.toHaveAttribute("items");
  });
});
