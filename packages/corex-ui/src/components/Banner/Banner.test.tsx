import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Banner } from "./Banner";

describe("Banner", () => {
  it("maps legacy `status` to `tone` and `title` to `heading`", () => {
    render(<Banner title="Heads up" status="warning">Something to know.</Banner>);
    const el = screen.getByText("Something to know.");
    expect(el.tagName.toLowerCase()).toBe("s-banner");
    expect(el).toHaveAttribute("heading", "Heads up");
    expect(el).toHaveAttribute("tone", "warning");
  });

  it("binds onDismiss as a native dismiss listener", () => {
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss}>Dismiss me</Banner>);
    screen.getByText("Dismiss me").dispatchEvent(new Event("dismiss", { bubbles: true }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
