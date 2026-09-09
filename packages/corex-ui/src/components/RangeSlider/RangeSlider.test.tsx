import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RangeSlider } from "./RangeSlider";

describe("RangeSlider", () => {
  it("renders a range input with the right aria attributes", () => {
    render(
      <RangeSlider
        label="Quantity"
        id="qty"
        min={0}
        max={50}
        value={20}
        onChange={vi.fn()}
      />,
    );
    const input = screen.getByRole("slider") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-valuemin", "0");
    expect(input).toHaveAttribute("aria-valuemax", "50");
    expect(input).toHaveAttribute("aria-valuenow", "20");
    expect(input.value).toBe("20");
  });

  it("fires onChange with the new numeric value and id on input", () => {
    const onChange = vi.fn();
    render(<RangeSlider label="Quantity" id="qty" value={20} onChange={onChange} />);
    const input = screen.getByRole("slider");

    fireEvent.change(input, { target: { value: "35" } });

    expect(onChange).toHaveBeenCalledWith(35, "qty");
  });

  it("clamps a value outside of min/max for display", () => {
    render(
      <RangeSlider
        label="Quantity"
        id="qty"
        min={0}
        max={10}
        value={999}
        onChange={vi.fn()}
      />,
    );
    const input = screen.getByRole("slider") as HTMLInputElement;
    expect(input.value).toBe("10");
  });

  it("marks the input invalid and renders the error message when error is set", () => {
    render(
      <RangeSlider
        label="Quantity"
        id="qty"
        value={5}
        error="Must be at least 10"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("slider")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Must be at least 10")).toBeInTheDocument();
  });

  it("renders the output tooltip bubble with current value when output is true", () => {
    render(
      <RangeSlider
        label="Quantity"
        id="qty"
        value={25}
        output
        onChange={vi.fn()}
      />,
    );
    const output = screen.getByRole("status");
    expect(output).toBeInTheDocument();
    expect(output).toHaveTextContent("25");
  });

  it("disables the input and hides the output bubble when disabled", () => {
    render(
      <RangeSlider
        label="Quantity"
        id="qty"
        value={5}
        disabled
        output
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("slider")).toBeDisabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders help text associated via aria-describedby", () => {
    render(
      <RangeSlider
        label="Quantity"
        id="qty"
        value={5}
        helpText="Pick a value"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Pick a value")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-describedby",
      "qtyHelpText",
    );
  });
});
