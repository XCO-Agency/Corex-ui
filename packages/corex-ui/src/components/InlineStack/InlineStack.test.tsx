import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InlineStack } from "./InlineStack";

describe("InlineStack", () => {
  it("renders an s-stack pinned to direction=inline with legacy gap='200' mapped to small-200", () => {
    render(<InlineStack gap="200">Item</InlineStack>);
    const el = screen.getByText("Item");
    expect(el.tagName.toLowerCase()).toBe("s-stack");
    expect(el).toHaveAttribute("direction", "inline");
    expect(el).toHaveAttribute("gap", "small-200");
  });

  it("passes modern PolarisSpacingType tokens through unchanged", () => {
    render(<InlineStack gap="small-200">Item Modern</InlineStack>);
    const el = screen.getByText("Item Modern");
    expect(el).toHaveAttribute("gap", "small-200");
  });

  it("supports two-value shorthand spacing", () => {
    render(<InlineStack gap="200 400">Item Shorthand</InlineStack>);
    const el = screen.getByText("Item Shorthand");
    expect(el).toHaveAttribute("gap", "small-200 base");
  });
});
