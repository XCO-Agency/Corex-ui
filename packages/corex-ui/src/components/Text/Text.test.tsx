import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders heading variants as s-heading", () => {
    render(
      <Text variant="headingMd" tone="success">
        Hello
      </Text>,
    );

    const el = screen.getByText("Hello");
    expect(el.tagName.toLowerCase()).toBe("s-heading");
    expect(el).toHaveAttribute("data-legacy-variant", "headingMd");
    expect(el).toHaveAttribute("tone", "success");
  });
});
