import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders an s-button with translated legacy props", () => {
    render(
      <Button primary destructive fullWidth url="https://example.com" external>
        Save
      </Button>,
    );

    const el = screen.getByText("Save");
    expect(el.tagName.toLowerCase()).toBe("s-button");
    expect(el).toHaveAttribute("variant", "primary");
    expect(el).toHaveAttribute("tone", "critical");
    expect(el).toHaveAttribute("href", "https://example.com");
    expect(el).toHaveAttribute("target", "_blank");
  });

  it("supports the legacy `content` prop as an alias for children", () => {
    render(<Button content="Delete" />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("binds onClick as a native click listener", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    screen.getByText("Click me").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
