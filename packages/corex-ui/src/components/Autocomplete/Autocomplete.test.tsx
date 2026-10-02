import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Autocomplete } from "./Autocomplete";

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("Autocomplete", () => {
  it("renders the field and its options when open", () => {
    const { container } = render(
      <Autocomplete
        open
        textField={<Autocomplete.TextField label="Tags" value="" autoComplete="off" />}
        options={options}
      />,
    );

    expect(container.querySelector("s-text-field")).not.toBeNull();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("renders options inside FlexPopover", () => {
    render(
      <Autocomplete
        open
        textField={<Autocomplete.TextField label="Tags" value="" autoComplete="off" />}
        options={options}
      />,
    );

    const popover = document.querySelector(".corex-native-popover");
    expect(popover).not.toBeNull();
    expect(popover?.querySelectorAll('[role="option"]')).toHaveLength(2);
  });

  it("replaces the selection when multiple is not allowed", () => {
    const onSelect = vi.fn();
    render(
      <Autocomplete open options={options} selected={["a"]} onSelect={onSelect} />,
    );

    fireEvent.mouseDown(screen.getAllByRole("option")[1]!);

    expect(onSelect).toHaveBeenCalledWith(["b"]);
  });

  it("toggles a value in and out when multiple is allowed", () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <Autocomplete open options={options} selected={["a"]} onSelect={onSelect} allowMultiple />,
    );

    fireEvent.mouseDown(screen.getAllByRole("option")[1]!);
    expect(onSelect).toHaveBeenCalledWith(["a", "b"]);

    rerender(
      <Autocomplete
        open
        options={options}
        selected={["a", "b"]}
        onSelect={onSelect}
        allowMultiple
      />,
    );
    fireEvent.mouseDown(screen.getAllByRole("option")[0]!);
    expect(onSelect).toHaveBeenCalledWith(["b"]);
  });

  it("shows the empty state instead of an empty list", () => {
    render(<Autocomplete open options={[]} emptyState={<span>No matches</span>} />);

    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("shows the loading row instead of the options", () => {
    render(<Autocomplete open options={options} loading />);

    expect(document.querySelector("s-spinner")).not.toBeNull();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
