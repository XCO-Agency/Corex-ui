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
});
