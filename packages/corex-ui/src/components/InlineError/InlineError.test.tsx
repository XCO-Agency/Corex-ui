import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { InlineError } from "./InlineError";

describe("InlineError", () => {
  it("renders nothing without a message", () => {
    const { container } = render(<InlineError fieldID="email" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the message in a critical tone, tied to the field", () => {
    const { container } = render(
      <InlineError message="Email is required" fieldID="email" />,
    );
    const el = container.querySelector("s-text")!;

    expect(el).toHaveTextContent("Email is required");
    expect(el).toHaveAttribute("tone", "critical");
    expect(el).toHaveAttribute("id", "email-error");
  });
});
