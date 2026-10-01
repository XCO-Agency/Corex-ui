import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Scrollable } from "./Scrollable";

describe("Scrollable", () => {
  it("renders an s-scroll-box and leaves overflow to the element by default", () => {
    const { container } = render(<Scrollable>content</Scrollable>);
    const el = container.querySelector("s-scroll-box")!;

    expect(el).not.toBeNull();
    expect(el).not.toHaveAttribute("overflow");
  });

  it("maps the legacy axis flags onto the block/inline shorthand", () => {
    const { container } = render(<Scrollable horizontal>content</Scrollable>);

    expect(container.querySelector("s-scroll-box")).toHaveAttribute(
      "overflow",
      "auto auto",
    );
  });

  it("hides the block axis when only horizontal scrolling is asked for", () => {
    const { container } = render(
      <Scrollable horizontal vertical={false}>
        content
      </Scrollable>,
    );

    expect(container.querySelector("s-scroll-box")).toHaveAttribute(
      "overflow",
      "hidden auto",
    );
  });

  it("makes the pane focusable on request", () => {
    const { container } = render(<Scrollable focusable>content</Scrollable>);

    expect(container.querySelector("s-scroll-box")).toHaveAttribute("tabindex", "0");
  });
});
