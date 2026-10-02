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
      <Autocomplete open label="Tags" value="" options={options} />,
    );

    expect(container.querySelector("input")).not.toBeNull();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("renders options inside FlexPopover", () => {
    render(<Autocomplete open label="Tags" value="" options={options} />);

    const popover = document.querySelector(".corex-native-popover");
    expect(popover).not.toBeNull();
    expect(popover?.querySelectorAll('[role="option"]')).toHaveLength(2);
  });

  it("calls onSelect with the selected value when an option is chosen", () => {
    const onSelect = vi.fn();
    render(<Autocomplete open options={options} selected="a" onSelect={onSelect} />);

    fireEvent.click(screen.getAllByRole("option")[1]!);

    expect(onSelect).toHaveBeenCalledWith("b");
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
