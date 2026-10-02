import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders an s-badge with a tone attribute", () => {
    render(<Badge tone="warning">Pending</Badge>);
    const el = screen.getByText("Pending");
    expect(el.tagName.toLowerCase()).toBe("s-badge");
    expect(el).toHaveAttribute("tone", "warning");
  });

  it("maps v12's attention tone onto caution", () => {
    const { container } = render(<Badge tone="attention">Unfulfilled</Badge>);

    expect(container.querySelector("s-badge")).toHaveAttribute("tone", "caution");
  });

  it("maps v12's magic tone onto info", () => {
    const { container } = render(<Badge tone="magic">AI</Badge>);

    expect(container.querySelector("s-badge")).toHaveAttribute("tone", "info");
  });

  it("passes the tones s-badge has straight through", () => {
    const { container } = render(<Badge tone="success">Paid</Badge>);

    expect(container.querySelector("s-badge")).toHaveAttribute("tone", "success");
  });
});
