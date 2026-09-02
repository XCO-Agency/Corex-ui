import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlockStack } from "./BlockStack";

describe("BlockStack", () => {
  it("renders an s-stack pinned to direction=block", () => {
    render(<BlockStack gap="400">Item</BlockStack>);
    const el = screen.getByText("Item");
    expect(el.tagName.toLowerCase()).toBe("s-stack");
    expect(el).toHaveAttribute("direction", "block");
    expect(el).toHaveAttribute("gap", "base");
  });
});
