import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Box } from "./Box";

describe("Box", () => {
  it("renders an s-box with layout attributes", () => {
    render(<Box padding="400">Content</Box>);
    const el = screen.getByText("Content");
    expect(el.tagName.toLowerCase()).toBe("s-box");
    expect(el).toHaveAttribute("padding", "400");
  });
});
