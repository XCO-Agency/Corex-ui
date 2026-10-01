import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Autocomplete } from "./Autocomplete";

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("Autocomplete", () => {
  it("renders the field and its options", () => {
    const { container } = render(
      <Autocomplete
        textField={<Autocomplete.TextField label="Tags" value="" autoComplete="off" />}
        options={options}
      />,
    );

    expect(container.querySelector("s-text-field")).not.toBeNull();
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(2);
  });

  it("replaces the selection when multiple is not allowed", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Autocomplete options={options} selected={["a"]} onSelect={onSelect} />,
    );

    fireEvent.mouseDown(container.querySelectorAll('[role="option"]')[1]!);

    expect(onSelect).toHaveBeenCalledWith(["b"]);
  });

  it("toggles a value in and out when multiple is allowed", () => {
    const onSelect = vi.fn();
    const { container, rerender } = render(
      <Autocomplete options={options} selected={["a"]} onSelect={onSelect} allowMultiple />,
    );

    fireEvent.mouseDown(container.querySelectorAll('[role="option"]')[1]!);
    expect(onSelect).toHaveBeenCalledWith(["a", "b"]);

    rerender(
      <Autocomplete
        options={options}
        selected={["a", "b"]}
        onSelect={onSelect}
        allowMultiple
      />,
    );
    fireEvent.mouseDown(container.querySelectorAll('[role="option"]')[0]!);
    expect(onSelect).toHaveBeenCalledWith(["b"]);
  });

  it("shows the empty state instead of an empty list", () => {
    render(<Autocomplete options={[]} emptyState={<span>No matches</span>} />);

    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("shows the loading row instead of the options", () => {
    const { container } = render(<Autocomplete options={options} loading />);

    expect(container.querySelector("s-spinner")).not.toBeNull();
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(0);
  });
});
