import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Segment } from "./Segment";

const OPTIONS = [
  { label: "Min (1)", value: "min" },
  { label: "Max (purchased)", value: "max" },
];

describe("Segment", () => {
  it("sizes an option as icon-only when it has an icon and no label", () => {
    render(
      <Segment
        accessibilityLabel="Viewport"
        options={[
          { value: "desktop", icon: "desktop", accessibilityLabel: "Desktop" },
          { value: "tablet", icon: "tablet", label: "Tablet" },
        ]}
        value="desktop"
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole("radio", { name: "Desktop" })).toHaveAttribute(
      "data-icon-only",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Tablet" })).not.toHaveAttribute(
      "data-icon-only",
    );
    expect(document.querySelector("[data-slot='segment']")).not.toHaveAttribute(
      "data-icon-only",
    );
  });

  it("renders options without a label by default", () => {
    render(<Segment options={OPTIONS} value="min" onChange={() => {}} />);

    expect(screen.getByRole("radio", { name: "Min (1)" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Max (purchased)" })).toBeInTheDocument();
    expect(screen.queryByText("Default quantity")).not.toBeInTheDocument();
  });

  it("shows an optional label when provided", () => {
    render(
      <Segment
        label="Default quantity"
        options={OPTIONS}
        value="min"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Default quantity")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-labelledby",
      expect.stringContaining("label"),
    );
  });

  it("marks the selected option and calls onChange", () => {
    const onChange = vi.fn();

    render(<Segment options={OPTIONS} value="min" onChange={onChange} />);

    expect(screen.getByRole("radio", { name: "Min (1)" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Max (purchased)" })).toHaveAttribute(
      "aria-checked",
      "false",
    );

    fireEvent.click(screen.getByRole("radio", { name: "Max (purchased)" }));
    expect(onChange).toHaveBeenCalledWith("max");
  });

  it("supports uncontrolled selection via defaultValue", () => {
    const onChange = vi.fn();

    render(<Segment options={OPTIONS} defaultValue="min" onChange={onChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "Max (purchased)" }));
    expect(onChange).toHaveBeenCalledWith("max");
    expect(screen.getByRole("radio", { name: "Max (purchased)" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("applies variant, size, and fill attributes", () => {
    const { container } = render(
      <Segment
        options={OPTIONS}
        value="min"
        onChange={() => {}}
        variant="primary"
        size="large"
        inlineSize="fill"
      />,
    );

    const root = container.querySelector('[data-slot="segment"]');
    expect(root).toHaveAttribute("data-variant", "primary");
    expect(root).toHaveAttribute("data-size", "large");
    expect(root).toHaveAttribute("data-inline-size", "fill");
  });

  it("does not change value when disabled", () => {
    const onChange = vi.fn();

    render(<Segment options={OPTIONS} value="min" onChange={onChange} disabled />);

    fireEvent.click(screen.getByRole("radio", { name: "Max (purchased)" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("moves selection with arrow keys", () => {
    const onChange = vi.fn();

    render(<Segment options={OPTIONS} value="min" onChange={onChange} />);

    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("max");
  });
});
