import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  ConditionsRepeater,
  filterConditionOptions,
  optionsSearchShown,
} from "./ConditionsRepeater";

const many = Array.from({ length: 12 }, (_, index) => ({
  label: `Field ${index + 1}`,
  value: `f${index + 1}`,
  detail: index === 11 ? "Brand or supplier" : undefined,
}));

const searchOf = (container: ParentNode) => container.querySelector("s-search-field");
const optionLabels = () =>
  screen
    .queryAllByRole("option")
    .map((option) => option.getAttribute("accessibilitylabel"));

function search(container: ParentNode, value: string) {
  const field = searchOf(container) as HTMLElement & { value?: string };
  act(() => {
    field.value = value;
    fireEvent(field, new CustomEvent("input", { bubbles: true }));
  });
}

describe("ConditionsRepeater.Options search", () => {
  it("shows no search up to the threshold", () => {
    const { container } = render(
      <ConditionsRepeater.Options options={many.slice(0, 10)} onSelect={() => {}} />,
    );
    expect(searchOf(container)).toBeNull();
    expect(optionLabels()).toHaveLength(10);
  });

  it("shows a search past the threshold, which is a prop", () => {
    const { container, rerender } = render(
      <ConditionsRepeater.Options options={many.slice(0, 11)} onSelect={() => {}} />,
    );
    const field = searchOf(container)!;
    expect(field).toHaveAttribute("placeholder", "Search");
    expect(field).toHaveAttribute("label", "Search");

    rerender(
      <ConditionsRepeater.Options
        options={many.slice(0, 3)}
        searchThreshold={2}
        onSelect={() => {}}
      />,
    );
    expect(searchOf(container)).not.toBeNull();

    rerender(
      <ConditionsRepeater.Options
        options={many}
        searchable={false}
        onSelect={() => {}}
      />,
    );
    expect(searchOf(container)).toBeNull();
  });

  it("keeps the search outside the scrolling list", () => {
    const { container } = render(
      <ConditionsRepeater.Options options={many} onSelect={() => {}} />,
    );
    const listbox = screen.getByRole("listbox");
    const scroller = listbox.parentElement!;
    expect(scroller.contains(searchOf(container))).toBe(false);
    expect(searchOf(container)!.parentElement!.contains(scroller)).toBe(true);
  });

  it("filters on label and detail, ignoring case, and says when nothing matches", () => {
    const { container } = render(
      <ConditionsRepeater.Options
        options={many}
        noResultsText="No condition matches."
        onSelect={() => {}}
      />,
    );

    search(container, "FIELD 1");
    expect(optionLabels()).toEqual([
      "Field 1",
      "Field 10",
      "Field 11",
      "Field 12. Brand or supplier",
    ]);

    search(container, "supplier");
    expect(optionLabels()).toEqual(["Field 12. Brand or supplier"]);

    search(container, "zzz");
    expect(optionLabels()).toEqual([]);
    expect(screen.getByText("No condition matches.")).toBeInTheDocument();
  });

  it("picks the first match on Enter in the search", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <ConditionsRepeater.Options options={many} onSelect={onSelect} />,
    );
    search(container, "supplier");
    fireEvent.keyDown(searchOf(container)!, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("f12");
  });

  it("moves between the search and the options with the arrow keys", () => {
    const { container } = render(
      <ConditionsRepeater.Options options={many} onSelect={() => {}} />,
    );
    const field = searchOf(container) as HTMLElement;
    const rows = screen.getAllByRole("option");
    rows.forEach((row) => row.setAttribute("tabindex", "0"));
    field.setAttribute("tabindex", "0");

    field.focus();
    fireEvent.keyDown(field, { key: "ArrowDown" });
    expect(document.activeElement).toBe(rows[0]);
    fireEvent.keyDown(rows[0]!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(rows[1]);
    fireEvent.keyDown(rows[1]!, { key: "End" });
    expect(document.activeElement).toBe(rows[11]);
    fireEvent.keyDown(rows[11]!, { key: "Home" });
    expect(document.activeElement).toBe(rows[0]);
    fireEvent.keyDown(rows[0]!, { key: "ArrowUp" });
    expect(document.activeElement).toBe(field);
  });

  it("focuses the search when it mounts", async () => {
    const { container } = render(
      <ConditionsRepeater.Options options={many} onSelect={() => {}} />,
    );
    const field = searchOf(container) as HTMLElement;
    field.setAttribute("tabindex", "0");
    await act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(null))));
    expect(document.activeElement).toBe(field);
  });

  it("starts with an empty query each time the add menu opens", () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <ConditionsRepeater
          items={[{ id: 1 }]}
          renderControls={() => <ConditionsRepeater.Pill label="Title" />}
          addMenuOpen={open}
          onAddMenuOpenChange={setOpen}
          addMenu={<ConditionsRepeater.Options options={many} onSelect={() => {}} />}
        />
      );
    }
    render(<Harness />);
    const add = screen.getByText("Add condition").closest("s-button")!;

    fireEvent.click(add);
    search(document, "supplier");
    expect(optionLabels()).toHaveLength(1);
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(add).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(add);
    expect((searchOf(document) as HTMLElement & { value?: string }).value).toBe("");
    expect(optionLabels()).toHaveLength(12);
  });
});

describe("options helpers", () => {
  it("filter and decide on the search", () => {
    expect(filterConditionOptions(many, "  ").length).toBe(12);
    expect(filterConditionOptions(many, "brand").map((o) => o.value)).toEqual(["f12"]);
    expect(optionsSearchShown(10, undefined, 10)).toBe(false);
    expect(optionsSearchShown(11, undefined, 10)).toBe(true);
    expect(optionsSearchShown(3, true, 10)).toBe(true);
  });
});

describe("ConditionsRepeater trash tooltip", () => {
  type ItemType = { id: number; name: string };
  const items: ItemType[] = [{ id: 1, name: "Title" }];
  const base = {
    items,
    renderControls: (item: ItemType) => <ConditionsRepeater.Pill label={item.name} />,
    onRemove: () => {},
  };
  const tooltip = (container: HTMLElement) => container.querySelector("s-tooltip");
  const trash = (container: HTMLElement) =>
    container.querySelector('s-button[icon="delete"]')!;

  it("shows the remove label by default, tied to the trash button", () => {
    const { container } = render(
      <ConditionsRepeater<ItemType>
        {...base}
        removeAccessibilityLabel={(item) => `Remove ${item.name} condition`}
      />,
    );
    const tip = tooltip(container)!;
    expect(tip).toHaveTextContent("Remove Title condition");
    expect(trash(container)).toHaveAttribute("interestfor", tip.id);
  });

  it("stays inside the fading slot, so it hides with the button", () => {
    const { container } = render(<ConditionsRepeater<ItemType> {...base} />);
    const slot = trash(container).closest(".cx-hoverable-slot")!;
    expect(slot.contains(tooltip(container))).toBe(true);
    expect(slot).toHaveAttribute("data-keep-space", "true");
  });

  it("takes an override, or false for none", () => {
    const { container, rerender } = render(
      <ConditionsRepeater<ItemType>
        {...base}
        removeTooltip={(item) => `Delete ${item.name}`}
      />,
    );
    expect(tooltip(container)).toHaveTextContent("Delete Title");

    rerender(<ConditionsRepeater<ItemType> {...base} removeTooltip={false} />);
    expect(tooltip(container)).toBeNull();
    expect(trash(container)).toHaveAttribute("accessibilitylabel", "Remove condition");
  });
});
