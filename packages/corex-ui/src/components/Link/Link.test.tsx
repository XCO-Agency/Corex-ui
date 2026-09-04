import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "./Link";

describe("Link", () => {
  it("maps url/external to href/target/rel", () => {
    render(
      <Link url="https://example.com" external>
        Docs
      </Link>,
    );
    const el = screen.getByText("Docs");
    expect(el.tagName.toLowerCase()).toBe("s-link");
    expect(el).toHaveAttribute("href", "https://example.com");
    expect(el).toHaveAttribute("target", "_blank");
  });

  it("binds onClick as a native click listener", () => {
    const onClick = vi.fn();
    render(<Link onClick={onClick}>Click me</Link>);
    screen
      .getByText("Click me")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
