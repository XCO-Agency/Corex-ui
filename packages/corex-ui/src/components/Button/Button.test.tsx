import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
import { Icon } from "../Icon";

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

  it("binds onClick as a native click listener", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    screen
      .getByText("Click me")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not pass style prop down to s-button", () => {
    render(<Button style={{ color: "red" } as any}>Styled</Button>);

    const el = screen.getByText("Styled");
    expect(el).not.toHaveAttribute("style");
  });

  describe("accessible name", () => {
    it("takes the name from a string child", () => {
      render(<Button>Save</Button>);
      expect(screen.getByText("Save")).toHaveAttribute("accessibilitylabel", "Save");
    });

    it("takes the name from the text alongside an icon", () => {
      const { container } = render(
        <Button variant="plain">
          <Icon type="play" /> Resume
        </Button>,
      );

      const el = container.querySelector("s-button")!;
      expect(el).toHaveAttribute("accessibilitylabel", "Resume");
    });

    it("falls back to a generated name for an icon-only button", () => {
      const { container } = render(
        <Button variant="plain">
          <Icon type="play" />
        </Button>,
      );

      const el = container.querySelector("s-button")!;
      expect(el.getAttribute("accessibilitylabel")).toBe("Action plain");
    });

    it("prefers an explicit accessibilityLabel over the children text", () => {
      const { container } = render(
        <Button accessibilityLabel="Resume playback">
          <Icon type="play" /> Resume
        </Button>,
      );

      const el = container.querySelector("s-button")!;
      expect(el).toHaveAttribute("accessibilitylabel", "Resume playback");
    });
  });

  describe("v12 props with no s-button equivalent", () => {
    it("ignores `size` rather than passing it to the element", () => {
      const { container } = render(<Button size="slim">Save</Button>);

      expect(container.querySelector("s-button")).not.toHaveAttribute("size");
    });

    it("falls back to the default tone for success and magic", () => {
      const { container } = render(<Button tone="success">Publish</Button>);

      expect(container.querySelector("s-button")).not.toHaveAttribute("tone");
    });

    it("still maps the tones s-button does have", () => {
      const { container } = render(<Button tone="critical">Delete</Button>);

      expect(container.querySelector("s-button")).toHaveAttribute("tone", "critical");
    });
  });
});
