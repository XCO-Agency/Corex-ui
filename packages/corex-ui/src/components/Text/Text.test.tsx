import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./Text";

describe("Text", () => {
  it("renders s-text directly when no wrapper is needed", () => {
    render(<Text data-testid="my-text">Hello World</Text>);
    const el = screen.getByTestId("my-text");
    expect(el.tagName.toLowerCase()).toBe("s-text");
    expect(el).toHaveTextContent("Hello World");
  });

  it("wraps in heading tag when heading is true", () => {
    const { container } = render(
      <Text heading variant="large">
        Heading Text
      </Text>,
    );
    const h2 = container.querySelector("h2");
    expect(h2).not.toBeNull();
    const sText = h2?.querySelector("s-text");
    expect(sText).not.toBeNull();
    expect(sText).toHaveTextContent("Heading Text");
  });

  it("renders tooltip element when tooltip prop is provided", () => {
    const { container } = render(
      <Text tooltip={<Text>Tooltip Content</Text>}>Hover Me</Text>,
    );
    const sTooltip = container.querySelector("s-tooltip");
    expect(sTooltip).not.toBeNull();
    const tooltipText = sTooltip?.querySelector("s-text");
    expect(tooltipText).toHaveTextContent("Tooltip Content");
  });
});
