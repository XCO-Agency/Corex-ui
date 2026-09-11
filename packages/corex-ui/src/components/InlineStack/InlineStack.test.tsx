import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InlineStack } from "./InlineStack";

describe("InlineStack", () => {
  it("renders a div with display: flex and direction=row", () => {
    render(<InlineStack gap="200">Item</InlineStack>);
    const el = screen.getByText("Item");
    expect(el.tagName.toLowerCase()).toBe("div");
    expect(el.style.display).toBe("flex");
    expect(el.style.flexDirection).toBe("row");
    expect(el.style.gap).toContain("var(--p-space-200, 8px)");
  });

  it("passes modern PolarisSpacingType tokens through to CSS variables", () => {
    render(<InlineStack gap="small-200">Item Modern</InlineStack>);
    const el = screen.getByText("Item Modern");
    expect(el.tagName.toLowerCase()).toBe("div");
    expect(el.style.gap).toContain("var(--p-space-200, 8px)");
  });

  it("supports two-value shorthand spacing", () => {
    render(<InlineStack gap="200 400">Item Shorthand</InlineStack>);
    const el = screen.getByText("Item Shorthand");
    expect(el.style.gap).toBe("var(--p-space-200, 8px) var(--p-space-400, 16px)");
  });

  it("supports additional props: style, className, grow, shrink, wrap", () => {
    render(
      <InlineStack
        className="custom-inline-stack"
        style={{ color: "rgb(255, 0, 0)" }}
        grow
        shrink={false}
        wrap
        align="center"
        blockAlign="end"
      >
        Item Props
      </InlineStack>,
    );
    const el = screen.getByText("Item Props");
    expect(el).toHaveClass("custom-inline-stack");
    expect(el.style.color).toBe("rgb(255, 0, 0)");
    expect(el.style.flexGrow).toBe("1");
    expect(el.style.flexShrink).toBe("0");
    expect(el.style.flexWrap).toBe("wrap");
    expect(el.style.justifyContent).toBe("center");
    expect(el.style.alignItems).toBe("flex-end");
  });
});
