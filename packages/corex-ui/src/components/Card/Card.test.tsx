import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders an s-section with an optional title", () => {
    render(<Card title="Details">Body content</Card>);
    expect(screen.getByText("Body content").closest("s-section")).not.toBeNull();
    expect(screen.getByText("Details").tagName.toLowerCase()).toBe("s-text");
  });

  it("renders without a title", () => {
    render(<Card>Just content</Card>);
    expect(screen.getByText("Just content").closest("s-section")).not.toBeNull();
  });
});
