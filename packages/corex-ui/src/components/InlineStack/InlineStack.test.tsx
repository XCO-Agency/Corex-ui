import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InlineStack } from "./InlineStack";

describe("InlineStack", () => {
  it("renders an s-stack pinned to direction=inline", () => {
    render(<InlineStack gap="200">Item</InlineStack>);
    const el = screen.getByText("Item");
    expect(el.tagName.toLowerCase()).toBe("s-stack");
    expect(el).toHaveAttribute("direction", "inline");
  });
});
