import { createRef } from "react";
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

  it("renders custom 'as' tag wrapper", () => {
    const { container } = render(<Text as="p">Paragraph Text</Text>);
    const p = container.querySelector("p");
    expect(p).not.toBeNull();
    expect(p?.querySelector("s-text")).not.toBeNull();
    expect(p).toHaveTextContent("Paragraph Text");
  });

  it("applies typography styles to the slotted content", () => {
    const { container } = render(
      <Text variant="headingLg" fontWeight="bold" tone="critical">
        Alert
      </Text>,
    );
    const span = container.querySelector("s-text > span");
    expect(span).not.toBeNull();
    expect(span).toHaveStyle({
      fontSize: "1.25rem",
      lineHeight: "1.6rem",
      fontWeight: "700",
    });
  });

  it("forwards ref to s-text element", () => {
    const ref = createRef<HTMLElement>();
    render(<Text ref={ref}>Ref Content</Text>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName.toLowerCase()).toBe("s-text");
  });

  it("handles numeric and breakWord props", () => {
    const { container } = render(
      <Text numeric breakWord>
        123456789
      </Text>,
    );
    const span = container.querySelector("s-text > span");
    expect(span).not.toBeNull();
    expect(span).toHaveStyle({
      fontVariantNumeric: "tabular-nums",
      wordBreak: "break-word",
    });
  });
});
