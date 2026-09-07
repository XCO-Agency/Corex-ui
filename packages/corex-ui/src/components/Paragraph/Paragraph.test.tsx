import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Paragraph } from "./Paragraph";

describe("Paragraph", () => {
  it("renders s-paragraph with text content", () => {
    render(<Paragraph data-testid="para">Hello World</Paragraph>);
    const el = screen.getByTestId("para");
    expect(el.tagName.toLowerCase()).toBe("s-paragraph");
    expect(el).toHaveTextContent("Hello World");
  });
});
