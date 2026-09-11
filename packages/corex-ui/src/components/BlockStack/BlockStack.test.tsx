import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlockStack } from "./BlockStack";

describe("BlockStack", () => {
  it("renders a div with display: flex and direction=column", () => {
    render(<BlockStack gap="400">Item</BlockStack>);
    const el = screen.getByText("Item");
    expect(el.tagName.toLowerCase()).toBe("div");
    expect(el.style.display).toBe("flex");
    expect(el.style.flexDirection).toBe("column");
    expect(el.style.gap).toContain("var(--p-space-400, 16px)");
  });

  it("passes modern PolarisSpacingType tokens through to CSS variables", () => {
    render(<BlockStack gap="small-200">Item Modern</BlockStack>);
    const el = screen.getByText("Item Modern");
    expect(el.tagName.toLowerCase()).toBe("div");
    expect(el.style.gap).toContain("var(--p-space-200, 8px)");
  });

  it("supports additional props: style, className, grow, shrink, wrap, align, inlineAlign", () => {
    render(
      <BlockStack
        className="custom-block-stack"
        style={{ padding: "10px" }}
        grow={2}
        shrink
        wrap
        align="center"
        inlineAlign="space-between"
      >
        Item Block Props
      </BlockStack>,
    );
    const el = screen.getByText("Item Block Props");
    expect(el).toHaveClass("custom-block-stack");
    expect(el.style.padding).toBe("10px");
    expect(el.style.flexGrow).toBe("2");
    expect(el.style.flexShrink).toBe("1");
    expect(el.style.flexWrap).toBe("wrap");
    expect(el.style.alignItems).toBe("center");
    expect(el.style.justifyContent).toBe("space-between");
  });
});
