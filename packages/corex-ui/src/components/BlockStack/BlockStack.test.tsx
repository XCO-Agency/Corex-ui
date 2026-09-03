import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlockStack } from "./BlockStack";

describe("BlockStack", () => {
  it("renders an s-stack pinned to direction=block with legacy gap='400' mapped to base", () => {
    render(<BlockStack gap="400">Item</BlockStack>);
    const el = screen.getByText("Item");
    expect(el.tagName.toLowerCase()).toBe("s-stack");
    expect(el).toHaveAttribute("direction", "block");
    expect(el).toHaveAttribute("gap", "base");
  });

  it("passes modern PolarisSpacingType tokens through unchanged", () => {
    render(<BlockStack gap="small-200">Item Modern</BlockStack>);
    const el = screen.getByText("Item Modern");
    expect(el).toHaveAttribute("gap", "small-200");
  });
});
