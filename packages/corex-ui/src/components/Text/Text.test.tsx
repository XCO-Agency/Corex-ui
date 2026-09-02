import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders an s-text element with variant/tone attributes", () => {
    render(
      <Text variant="headingMd" tone="success">
        Hello
      </Text>,
    );

    const el = screen.getByText("Hello");
    expect(el.tagName.toLowerCase()).toBe("s-text");
    expect(el).toHaveAttribute("variant", "headingMd");
    expect(el).toHaveAttribute("tone", "success");
  });
});
