import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  ConditionsRepeater,
  conditionsAtLimit,
  focusShowsRowActions,
  pointerStillInsideRow,
  releasePointerFocus,
  rowActionsVisible,
} from "./ConditionsRepeater";

type RuleType = { id: number; field: string; operator: string; value: string | null };

const rules: RuleType[] = [
  { id: 1, field: "Title", operator: "contains", value: "Summer" },
  { id: 2, field: "Status", operator: "Active", value: null },
];

const rows = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("[data-cx-conditions-row]"));
const trashOf = (row: Element) => row.querySelector('s-button[icon="delete"]');
const slotOf = (row: Element) => trashOf(row)?.closest(".cx-hoverable-slot");

function setup(props: Partial<Parameters<typeof ConditionsRepeater<RuleType>>[0]> = {}) {
  return render(
    <ConditionsRepeater<RuleType>
      items={rules}
      renderControls={(rule) => (
        <>
          <ConditionsRepeater.Pill label={rule.field} />
          <ConditionsRepeater.Pill label={rule.operator} />
        </>
      )}
      renderValue={(rule) => (rule.value === null ? null : <em>{rule.value}</em>)}
      onRemove={() => {}}
      onAdd={() => {}}
      {...props}
    />,
  );
}

describe("ConditionsRepeater", () => {
  it("renders one bordered card per row, with the controls on top", () => {
    const { container } = setup();
    expect(screen.getByRole("list", { name: "Conditions" })).toBeInTheDocument();
    expect(rows(container)).toHaveLength(2);
    const card = rows(container)[0]!.querySelector("s-box") as unknown as Record<
      string,
      unknown
    >;
    // Box sets these as properties on the host.
    expect(card.borderWidth).toBe("base");
    expect(card.borderRadius).toBe("large-200");
    expect(card.overflow).toBe("hidden");
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("contains")).toBeInTheDocument();
  });

  it("shows a value area under a divider only for rows that have one", () => {
    const { container } = setup();
    const [withValue, withoutValue] = rows(container);
    expect(withValue!.querySelector("s-divider")).not.toBeNull();
    expect(withValue).toHaveTextContent("Summer");
    expect(withoutValue!.querySelector("s-divider")).toBeNull();
  });

  it("shows the trash button only while the row is hovered", () => {
    const { container } = setup();
    const row = rows(container)[0]!;
    expect(slotOf(row)).toHaveAttribute("data-visible", "false");
    // Hidden in place: its space is kept, so nothing reflows as it shows.
    expect(slotOf(row)).toHaveAttribute("data-keep-space", "true");

    fireEvent.mouseOver(row.querySelector("s-box")!);
    expect(slotOf(row)).toHaveAttribute("data-visible", "true");
    expect(slotOf(rows(container)[1]!)).toHaveAttribute("data-visible", "false");
  });

  it("does not treat mouse focus as hover, but does keyboard focus", () => {
    const { container } = setup();
    const row = rows(container)[0]!;
    const pill = row.querySelector("s-clickable") as HTMLElement;

    fireEvent.pointerDown(document.body);
    fireEvent.focus(pill);
    expect(slotOf(row)).toHaveAttribute("data-visible", "false");

    fireEvent.keyDown(document.body, { key: "Tab" });
    fireEvent.focus(pill);
    expect(slotOf(row)).toHaveAttribute("data-visible", "true");
  });

  it("removes a row at once, with its label", () => {
    const onRemove = vi.fn();
    const { container } = setup({
      onRemove,
      removeAccessibilityLabel: (rule) => `Remove ${rule.field}`,
    });
    const trash = trashOf(rows(container)[1]!)!;
    expect(trash).toHaveAttribute("accessibilitylabel", "Remove Status");
    fireEvent.click(trash);
    expect(onRemove).toHaveBeenCalledWith(rules[1], 1);
  });

  it("has no trash button without onRemove", () => {
    const { container } = setup({ onRemove: undefined });
    expect(trashOf(rows(container)[0]!)).toBeNull();
  });

  it("adds through the add button", () => {
    const onAdd = vi.fn();
    setup({ onAdd, addLabel: "Add rule" });
    fireEvent.click(screen.getByText("Add rule").closest("s-button")!);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("turns the add button off at maxItems and says why", () => {
    setup({ maxItems: 2, limitNote: <span>Your plan allows 2 conditions</span> });
    expect(screen.getByText("Add condition").closest("s-button")).toHaveAttribute(
      "disabled",
    );
    expect(screen.getByText("Your plan allows 2 conditions")).toBeInTheDocument();
  });

  it("keeps the add button on under the limit, and the note hidden", () => {
    setup({ maxItems: 3, limitNote: <span>Limit note</span> });
    expect(screen.getByText("Add condition").closest("s-button")).not.toHaveAttribute(
      "disabled",
    );
    expect(screen.queryByText("Limit note")).toBeNull();
  });

  it("disables adding and removing when disabled", () => {
    const { container } = setup({ disabled: true });
    expect(screen.getByText("Add condition").closest("s-button")).toHaveAttribute(
      "disabled",
    );
    expect(trashOf(rows(container)[0]!)).toHaveAttribute("disabled");
  });

  it("shows the empty state in place of the rows, as critical text for a string", () => {
    setup({ items: [], emptyState: "Add a condition to save" });
    expect(screen.queryByRole("list")).toBeNull();
    const text = screen.getByText("Add a condition to save");
    expect(text.closest("s-text, s-paragraph")).toHaveAttribute("tone", "critical");
  });

  it("renders footerEnd opposite the add button", () => {
    setup({ footerEnd: <span>Pinned (2)</span> });
    expect(screen.getByText("Pinned (2)")).toBeInTheDocument();
  });

  it("opens the add menu from the add button and closes it on Escape", () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <ConditionsRepeater<RuleType>
          items={rules}
          renderControls={(rule) => <ConditionsRepeater.Pill label={rule.field} />}
          addMenu={<span>Field menu</span>}
          addMenuOpen={open}
          onAddMenuOpenChange={setOpen}
        />
      );
    }
    render(<Harness />);
    const add = screen.getByText("Add condition").closest("s-button")!;
    expect(add).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(add);
    expect(add).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Field menu")).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(add).toHaveAttribute("aria-expanded", "false");
  });

  it("grows in rows added after the first render, not the first ones", () => {
    const { container, rerender } = setup();
    const collapsedFirst = rows(container)[0]!.closest('[aria-hidden="true"]');
    expect(collapsedFirst).toBeNull();

    rerender(
      <ConditionsRepeater<RuleType>
        items={[...rules, { id: 3, field: "Vendor", operator: "is", value: "" }]}
        renderControls={(rule) => <ConditionsRepeater.Pill label={rule.field} />}
      />,
    );
    expect(rows(container)).toHaveLength(3);
  });
});

describe("ConditionsRepeater hover in another document", () => {
  // Regression: the pointer tracker listened on the module's global document.
  // Rendered into an iframe (the docs preview), it kept the outer page's
  // coordinates, the hit-test after each render landed outside the row, and
  // the hover was cancelled a frame after it began: the trash flashed.
  it("keeps the trash button shown while the pointer stays on the row", async () => {
    const iframe = document.createElement("iframe");
    document.body.append(iframe);
    const doc = iframe.contentDocument!;
    const host = doc.createElement("div");
    doc.body.append(host);

    // The outer page last saw the pointer far away from the row.
    fireEvent.pointerMove(document, { clientX: 900, clientY: 900 });

    const { container, unmount } = render(
      <ConditionsRepeater<RuleType>
        items={rules}
        renderControls={(rule) => <ConditionsRepeater.Pill label={rule.field} />}
        onRemove={() => {}}
      />,
      { container: host },
    );
    const row = rows(container)[0]!;
    const card = row.querySelector("s-box")!;
    // What the frame's own document has under each point.
    (
      doc as Document & { elementsFromPoint: Document["elementsFromPoint"] }
    ).elementsFromPoint = (x: number) => (x < 100 ? [card] : [doc.body]);

    const view = doc.defaultView!;
    // jsdom has no PointerEvent; a MouseEvent of that type carries the point.
    const move = (clientX: number, clientY: number) =>
      doc.body.dispatchEvent(
        new view.MouseEvent("pointermove", { clientX, clientY, bubbles: true }),
      );
    move(10, 10);
    fireEvent.mouseOver(card);
    expect(slotOf(row)).toHaveAttribute("data-visible", "true");

    // A few frames and re-renders later, and another move on the row.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
    });
    move(20, 10);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
    });
    expect(slotOf(row)).toHaveAttribute("data-visible", "true");

    // Off the row, it hides.
    move(500, 10);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect(slotOf(row)).toHaveAttribute("data-visible", "false");

    unmount();
    iframe.remove();
  });
});

describe("ConditionsRepeater.Pill", () => {
  it("is a subdued capsule with a select chevron", () => {
    render(<ConditionsRepeater.Pill label="Title" />);
    const pill = screen.getByText("Title").closest("s-clickable")!;
    expect(pill).toHaveAttribute("background", "subdued");
    expect(pill).toHaveAttribute("borderradius", "large-200");
    expect(pill).toHaveAttribute("paddingblock", "small-300");
    expect(pill).toHaveAttribute("paddinginline", "small-100");
    expect(pill.querySelector('s-icon[type="select"]')).not.toBeNull();
  });

  it("toggles its menu and reports aria-expanded", () => {
    const onOpenChange = vi.fn();
    render(
      <ConditionsRepeater.Pill
        label="contains"
        open={false}
        menu={<span>Operators</span>}
        onOpenChange={onOpenChange}
      />,
    );
    const pill = screen.getByText("contains").closest("s-clickable")!;
    expect(pill).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(pill);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("does nothing when disabled", () => {
    const onClick = vi.fn();
    render(<ConditionsRepeater.Pill label="Any" disabled onClick={onClick} />);
    fireEvent.click(screen.getByText("Any").closest("s-clickable")!);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("ConditionsRepeater.Options", () => {
  it("checks the selected option and picks on click", () => {
    const onSelect = vi.fn();
    render(
      <ConditionsRepeater.Options
        options={[
          { label: "All conditions", value: "AND", detail: "Every one must match" },
          { label: "Any condition", value: "OR" },
        ]}
        selected="AND"
        onSelect={onSelect}
      />,
    );
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveAttribute("background", "subdued");
    expect(options[0]!.querySelector('s-icon[type="check"]')).not.toBeNull();
    expect(options[1]!.querySelector('s-icon[type="check"]')).toBeNull();
    expect(screen.getByText("Every one must match")).toBeInTheDocument();
    fireEvent.click(options[1]!);
    expect(onSelect).toHaveBeenCalledWith("OR");
  });
});

describe("helpers", () => {
  it("decide when the trash button shows", () => {
    expect(focusShowsRowActions("keyboard")).toBe(true);
    expect(focusShowsRowActions("pointer")).toBe(false);
    expect(rowActionsVisible(false, false)).toBe(false);
    expect(rowActionsVisible(true, false)).toBe(true);
    expect(rowActionsVisible(false, true)).toBe(true);
  });

  it("finds the pointer inside a row through shadow roots", () => {
    const row = document.createElement("div");
    const host = document.createElement("span");
    row.append(host);
    const inner = document.createElement("b");
    host.attachShadow({ mode: "open" }).append(inner);
    document.body.append(row);
    expect(pointerStillInsideRow(row, [inner])).toBe(true);
    expect(pointerStillInsideRow(row, [document.body])).toBe(false);
    row.remove();
  });

  it("drops focus after a pointer click on a menu anchor, not a keyboard one", () => {
    const blur = vi.fn();
    const target = { closest: () => ({ blur }) } as unknown as EventTarget;
    releasePointerFocus({ detail: 0, target });
    expect(blur).not.toHaveBeenCalled();
    releasePointerFocus({ detail: 1, target });
    expect(blur).toHaveBeenCalledTimes(1);
  });

  it("knows the limit", () => {
    expect(conditionsAtLimit(1, 1)).toBe(true);
    expect(conditionsAtLimit(0, 1)).toBe(false);
    expect(conditionsAtLimit(5, undefined)).toBe(false);
  });
});
