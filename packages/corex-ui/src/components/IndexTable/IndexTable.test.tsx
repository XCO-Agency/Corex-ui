import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { IndexTable } from "./IndexTable";

// jsdom has no PointerEvent; without it pointer events carry no coordinates.
if (typeof window.PointerEvent === "undefined") {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
    }
  }
  (window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill;
}

/** The stubbed `s-checkbox` reports through `checked` plus a native `change`. */
function toggle(checkbox: Element) {
  const el = checkbox as HTMLElement & { checked?: boolean };
  el.checked = true;
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function renderTable(props: Partial<Parameters<typeof IndexTable>[0]> = {}) {
  return render(
    <IndexTable
      headings={[{ title: "Order" }, { title: "Total", format: "currency" }]}
      itemCount={2}
      resourceName={{ singular: "order", plural: "orders" }}
      {...props}
    >
      <IndexTable.Row id="1" position={0}>
        <IndexTable.Cell>#1001</IndexTable.Cell>
        <IndexTable.Cell>$24.00</IndexTable.Cell>
      </IndexTable.Row>
      <IndexTable.Row id="2" position={1}>
        <IndexTable.Cell>#1002</IndexTable.Cell>
        <IndexTable.Cell>$12.00</IndexTable.Cell>
      </IndexTable.Row>
    </IndexTable>,
  );
}

describe("IndexTable", () => {
  it("renders a header row of cells plus one for selection", () => {
    const { container } = renderTable();
    expect(screen.getByText("Order")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(container.querySelectorAll("s-checkbox").length).toBeGreaterThan(0);
    expect(screen.getByText("#1001")).toBeInTheDocument();
    expect(screen.getByText("#1002")).toBeInTheDocument();
  });

  it("drops the selection column when selectable is false", () => {
    const { container } = renderTable({ selectable: false });

    expect(screen.getByText("Order")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(container.querySelector("s-checkbox")).toBeNull();
  });

  it("reports a row selection with v12's three arguments", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderTable({ onSelectionChange });

    const checkboxes = container.querySelectorAll("s-checkbox");
    toggle(checkboxes[1]!); // first row checkbox

    expect(onSelectionChange).toHaveBeenCalledWith("single", true, "1");
  });

  it("reports the header checkbox as a page selection", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderTable({ onSelectionChange });

    const headerCheckbox = container.querySelector("s-checkbox")!;
    toggle(headerCheckbox);

    expect(onSelectionChange).toHaveBeenCalledWith("page", true);
  });

  it("does not open the row when its checkbox is clicked", () => {
    const onClick = vi.fn();
    const { container } = render(
      <IndexTable headings={[{ title: "Order" }]} itemCount={1}>
        <IndexTable.Row id="1" onClick={onClick}>
          <IndexTable.Cell>#1001</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    const rowCheckbox = container.querySelectorAll("s-checkbox")[1]!;
    fireEvent.click(rowCheckbox);
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("#1001"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows the bulk bar only once something is selected", () => {
    const { container, rerender } = render(
      <IndexTable
        headings={[{ title: "Order" }]}
        itemCount={2}
        bulkActions={[{ content: "Archive" }]}
      >
        <IndexTable.Row id="1">
          <IndexTable.Cell>#1001</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    expect(screen.queryByText("Archive")).not.toBeInTheDocument();

    rerender(
      <IndexTable
        headings={[{ title: "Order" }]}
        itemCount={2}
        selectedItemsCount={1}
        bulkActions={[{ content: "Archive" }]}
      >
        <IndexTable.Row id="1" selected>
          <IndexTable.Cell>#1001</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    expect(screen.getByText("1 selected")).toBeInTheDocument();
    expect(container.querySelector("[role='table']")).not.toBeNull();
  });

  it("understands selectedItemsCount='All'", () => {
    render(
      <IndexTable
        headings={[{ title: "Order" }]}
        itemCount={240}
        selectedItemsCount="All"
        resourceName={{ singular: "order", plural: "orders" }}
        bulkActions={[{ content: "Archive" }]}
      >
        <IndexTable.Row id="1" selected>
          <IndexTable.Cell>#1001</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    expect(screen.getByText("All 240 orders selected")).toBeInTheDocument();
  });

  it("renders the empty state instead of the table", () => {
    render(
      <IndexTable
        headings={[{ title: "Order" }]}
        itemCount={0}
        emptyState={<span>No orders yet</span>}
      />,
    );

    expect(screen.getByText("No orders yet")).toBeInTheDocument();
    expect(screen.queryByText("Order")).not.toBeInTheDocument();
  });

  it("renders pagination controls", () => {
    const onNext = vi.fn();
    const { container } = renderTable({
      pagination: { hasNext: true, hasPrevious: false, onNext },
    });

    const nextBtn = container.querySelector("s-button[accessibility-label='Next page']")!;
    expect(nextBtn).toBeInTheDocument();
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
  it("renders real rows on one shared grid", () => {
    const { container } = renderTable();

    expect(container.querySelectorAll("[role='table']")).toHaveLength(1);
    // header row + 2 body rows
    expect(container.querySelectorAll("[role='row']")).toHaveLength(3);
    expect(container.querySelectorAll("[role='row'] > [role='cell']")).toHaveLength(6);
  });

  it("pins a whole column when one of its cells is sticky", () => {
    render(
      <IndexTable headings={[{ title: "Order" }, { title: "Total" }]} itemCount={1}>
        <IndexTable.Row id="1">
          <IndexTable.Cell sticky="left">#1001</IndexTable.Cell>
          <IndexTable.Cell>$24.00</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    const cellOf = (text: string) =>
      screen.getByText(text).closest(".cx-it__cell") as HTMLElement;

    expect(cellOf("#1001")).toHaveClass("cx-it__cell--sticky");
    expect(cellOf("Order")).toHaveClass("cx-it__cell--sticky");
    expect(cellOf("Order").style.insetInlineStart).toBe("32px");
    expect(cellOf("$24.00")).not.toHaveClass("cx-it__cell--sticky");
  });

  it("marks selected rows for the rounded selected style", () => {
    const { container } = render(
      <IndexTable headings={[{ title: "Order" }]} itemCount={2}>
        <IndexTable.Row id="1" selected>
          <IndexTable.Cell>#1001</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    expect(container.querySelector("#\\31")).toHaveAttribute("aria-selected", "true");
  });

  it("ignores row clicks that start on a control inside the row", () => {
    const onClick = vi.fn();
    render(
      <IndexTable headings={[{ title: "Order" }]} itemCount={1} selectable={false}>
        <IndexTable.Row id="1" onClick={onClick}>
          <IndexTable.Cell>
            <button type="button">Edit</button>
          </IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("toggles sorting from a sortable heading", () => {
    const onSort = vi.fn();
    const { rerender } = render(
      <IndexTable
        headings={[{ title: "Created", sortable: true }]}
        itemCount={1}
        onSort={onSort}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Created/ }));
    expect(onSort).toHaveBeenLastCalledWith(0, "descending");

    rerender(
      <IndexTable
        headings={[{ title: "Created", sortable: true }]}
        itemCount={1}
        onSort={onSort}
        sortColumnIndex={0}
        sortDirection="descending"
      />,
    );
    expect(screen.getByText("Created").closest("[role='columnheader']")).toHaveAttribute(
      "aria-sort",
      "descending",
    );

    fireEvent.click(screen.getByRole("button", { name: /Created/ }));
    expect(onSort).toHaveBeenLastCalledWith(0, "ascending");
  });

  it("drags a row with a floating copy and a placeholder, then reorders", () => {
    const onReorder = vi.fn();
    const { container } = render(
      <IndexTable headings={[{ title: "Order" }]} itemCount={3} onReorder={onReorder}>
        {["a", "b", "c"].map((rowId) => (
          <IndexTable.Row key={rowId} id={rowId}>
            <IndexTable.Cell>{rowId}</IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>,
    );

    // jsdom has no layout: give each row a 40px slot.
    const rows = Array.from(container.querySelectorAll<HTMLElement>(".cx-it__row--body"));
    rows.forEach((row, index) => {
      row.getBoundingClientRect = () =>
        ({
          top: index * 40,
          bottom: index * 40 + 40,
          height: 40,
          left: 0,
          width: 600,
        }) as DOMRect;
    });

    const handle = screen.getAllByRole("button", { name: /Reorder row/ })[0]!;
    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientY: 20 });

    expect(container.querySelector(".cx-it__row--floating")).not.toBeNull();
    expect(rows[0]).toHaveClass("cx-it__row--placeholder");

    // Past the middle of the last row.
    fireEvent.pointerMove(document, { pointerId: 1, clientY: 110 });
    expect(rows[2]!.style.transform).toBe("translateY(-40px)");
    expect(rows[0]!.style.transform).toBe("translateY(80px)");

    fireEvent.pointerUp(document, { pointerId: 1, clientY: 110 });
    expect(onReorder).toHaveBeenCalledWith(0, 2);
    expect(container.querySelector(".cx-it__row--floating")).toBeNull();
    expect(rows[0]).not.toHaveClass("cx-it__row--placeholder");
    expect(rows[0]!.style.transform).toBe("");
  });

  it("collapses a dragged row's open sub-rows to a single placeholder", () => {
    const onReorder = vi.fn();
    const { container } = render(
      <IndexTable headings={[{ title: "Product" }]} itemCount={2} onReorder={onReorder}>
        <IndexTable.Row
          id="p1"
          defaultExpanded
          subRows={["v1", "v2"].map((variantId) => (
            <IndexTable.Row key={variantId} id={variantId}>
              <IndexTable.Cell>{variantId}</IndexTable.Cell>
            </IndexTable.Row>
          ))}
        >
          <IndexTable.Cell>Shirt</IndexTable.Cell>
        </IndexTable.Row>
        <IndexTable.Row id="p2">
          <IndexTable.Cell>Hat</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    const subRows = () => container.querySelector<HTMLElement>(".cx-it__subrows")!;

    const handle = screen.getAllByRole("button", { name: /Reorder row/ })[0]!;
    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientY: 0 });

    expect(subRows().style.display).toBe("none");
    expect(container.querySelectorAll(".cx-it__row--placeholder")).toHaveLength(1);

    fireEvent.pointerUp(document, { pointerId: 1, clientY: 0 });

    // Back, still expanded, once the drag ends.
    expect(subRows().style.display).toBe("");
    expect(screen.getByText("v2")).toBeInTheDocument();
  });

  it("cancels a drag with Escape", () => {
    const onReorder = vi.fn();
    const { container } = render(
      <IndexTable headings={[{ title: "Order" }]} itemCount={2} onReorder={onReorder}>
        <IndexTable.Row id="a">
          <IndexTable.Cell>a</IndexTable.Cell>
        </IndexTable.Row>
        <IndexTable.Row id="b">
          <IndexTable.Cell>b</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    const handle = screen.getAllByRole("button", { name: /Reorder row/ })[0]!;
    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientY: 0 });
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.pointerUp(document, { pointerId: 1, clientY: 200 });

    expect(onReorder).not.toHaveBeenCalled();
    expect(container.querySelector(".cx-it__row--floating")).toBeNull();
  });

  it("cascades selection between a parent row and its sub-rows", () => {
    const onSelectionChange = vi.fn();
    const renderTree = (selected: string[]) => (
      <IndexTable
        headings={[{ title: "Product" }]}
        itemCount={1}
        onSelectionChange={onSelectionChange}
      >
        <IndexTable.Row
          id="p1"
          selected={selected.includes("p1")}
          defaultExpanded
          subRows={["v1", "v2"].map((variantId) => (
            <IndexTable.Row
              key={variantId}
              id={variantId}
              selected={selected.includes(variantId)}
            >
              <IndexTable.Cell>{variantId}</IndexTable.Cell>
            </IndexTable.Row>
          ))}
        >
          <IndexTable.Cell>Shirt</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>
    );

    const { container, rerender } = render(renderTree([]));
    const selectCell = (rowId: string) =>
      container.querySelector(`[id='${rowId}'] .cx-it__cell--select`)!;

    // Parent selects itself and every child.
    fireEvent.click(selectCell("p1"));
    expect(onSelectionChange.mock.calls).toEqual([
      ["single", true, "p1"],
      ["single", true, "v1"],
      ["single", true, "v2"],
    ]);

    // One child selected: parent is indeterminate.
    onSelectionChange.mockClear();
    rerender(renderTree(["v1"]));
    const parentCheckbox = container.querySelector(
      "[id='p1'] s-checkbox",
    ) as HTMLElement & {
      indeterminate?: boolean;
      checked?: boolean;
    };
    expect(parentCheckbox.indeterminate).toBe(true);

    // Selecting the last child selects the parent too.
    fireEvent.click(selectCell("v2"));
    expect(onSelectionChange.mock.calls).toEqual([
      ["single", true, "v2"],
      ["single", true, "p1"],
    ]);

    // Deselecting a child of a fully selected parent deselects the parent.
    onSelectionChange.mockClear();
    rerender(renderTree(["p1", "v1", "v2"]));
    fireEvent.click(selectCell("v1"));
    expect(onSelectionChange.mock.calls).toEqual([
      ["single", false, "v1"],
      ["single", false, "p1"],
    ]);
  });

  it("moves a row with the arrow keys on its handle", () => {
    const onReorder = vi.fn();
    render(
      <IndexTable headings={[{ title: "Order" }]} itemCount={2} onReorder={onReorder}>
        <IndexTable.Row id="a">
          <IndexTable.Cell>a</IndexTable.Cell>
        </IndexTable.Row>
        <IndexTable.Row id="b">
          <IndexTable.Cell>b</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    const handles = screen.getAllByRole("button", { name: /Reorder row/ });
    fireEvent.keyDown(handles[1]!, { key: "ArrowUp" });
    expect(onReorder).toHaveBeenCalledWith(1, 0);

    onReorder.mockClear();
    fireEvent.keyDown(handles[0]!, { key: "ArrowUp" });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("keeps sub-rows mounted while they animate closed, then removes them", () => {
    vi.useFakeTimers();
    try {
      render(
        <IndexTable headings={[{ title: "Product" }]} itemCount={1}>
          <IndexTable.Row
            id="p1"
            defaultExpanded
            subRows={
              <IndexTable.Row id="v1">
                <IndexTable.Cell>Small</IndexTable.Cell>
              </IndexTable.Row>
            }
          >
            <IndexTable.Cell>Shirt</IndexTable.Cell>
          </IndexTable.Row>
        </IndexTable>,
      );

      const wrapper = screen.getByText("Small").closest(".cx-it__subrows") as HTMLElement;
      expect(wrapper).toHaveAttribute("role", "rowgroup");
      // The wrapper spans the grid as a subgrid, so the columns stay aligned.
      expect(wrapper).toHaveClass("cx-it__subrows");

      fireEvent.click(screen.getByRole("button", { name: "Collapse row" }));
      // Still there while the exit plays…
      expect(screen.getByText("Small")).toBeInTheDocument();
      expect(wrapper.style.opacity).toBe("0");

      act(() => {
        vi.advanceTimersByTime(300);
      });
      // …then gone.
      expect(screen.queryByText("Small")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("expands sub-rows from the first cell", () => {
    render(
      <IndexTable headings={[{ title: "Product" }]} itemCount={1}>
        <IndexTable.Row
          id="p1"
          subRows={
            <IndexTable.Row id="v1">
              <IndexTable.Cell>Small</IndexTable.Cell>
            </IndexTable.Row>
          }
        >
          <IndexTable.Cell>Shirt</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    expect(screen.queryByText("Small")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Expand row" }));
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Small").closest("[role='row']")).toHaveAttribute(
      "aria-level",
      "2",
    );
  });

  it("replaces the header row with the bulk bar while rows are selected", () => {
    render(
      <IndexTable
        headings={[{ title: "Order" }]}
        itemCount={2}
        selectedItemsCount={1}
        promotedBulkActions={[{ content: "Bulk edit" }]}
      >
        <IndexTable.Row id="1" selected>
          <IndexTable.Cell>#1001</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByText("Bulk edit")).toBeInTheDocument();
    expect(screen.queryByText("Order")).not.toBeInTheDocument();
  });

  it("shows only selected rows when 'Show all selected' is on", () => {
    const { container } = render(
      <IndexTable headings={[{ title: "Order" }]} itemCount={2} selectedItemsCount={1}>
        <IndexTable.Row id="1" selected>
          <IndexTable.Cell>#1001</IndexTable.Cell>
        </IndexTable.Row>
        <IndexTable.Row id="2">
          <IndexTable.Cell>#1002</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    const toggle = container.querySelector("s-switch") as HTMLElement & {
      checked?: boolean;
    };
    act(() => {
      toggle.checked = true;
      toggle.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(screen.getByText("#1001")).toBeInTheDocument();
    expect(screen.queryByText("#1002")).not.toBeInTheDocument();
  });
  it("selects from anywhere in the checkbox cell without opening the row", () => {
    const onClick = vi.fn();
    const onSelectionChange = vi.fn();
    const { container } = render(
      <IndexTable
        headings={[{ title: "Order" }]}
        itemCount={1}
        onSelectionChange={onSelectionChange}
      >
        <IndexTable.Row id="1" onClick={onClick}>
          <IndexTable.Cell>#1001</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    const selectCell = container.querySelector(".cx-it__row--body .cx-it__cell--select")!;
    fireEvent.click(selectCell);
    expect(onSelectionChange).toHaveBeenCalledWith("single", true, "1");

    // A click on the checkbox itself is left to its own change event.
    onSelectionChange.mockClear();
    fireEvent.click(selectCell.querySelector("s-checkbox")!);
    expect(onSelectionChange).not.toHaveBeenCalled();

    expect(onClick).not.toHaveBeenCalled();
  });

  it("guards row clicks when rendered into another document (iframe preview)", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const frameDocument = iframe.contentDocument!;
    const mount = frameDocument.createElement("div");
    frameDocument.body.appendChild(mount);

    const onClick = vi.fn();
    render(
      <IndexTable headings={[{ title: "Order" }]} itemCount={1} selectable={false}>
        <IndexTable.Row id="1" onClick={onClick}>
          <IndexTable.Cell>
            <button type="button">Edit</button>
          </IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
      { container: mount },
    );

    fireEvent.click(mount.querySelector("button")!);
    expect(onClick).not.toHaveBeenCalled();
    iframe.remove();
  });

  it("hides the checkbox of a row marked selectable={false}", () => {
    const { container } = render(
      <IndexTable headings={[{ title: "Product" }]} itemCount={1}>
        <IndexTable.Row
          id="p1"
          defaultExpanded
          subRows={
            <IndexTable.Row id="v1" selectable={false}>
              <IndexTable.Cell>Small</IndexTable.Cell>
            </IndexTable.Row>
          }
        >
          <IndexTable.Cell>Shirt</IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>,
    );

    const childRow = screen.getByText("Small").closest("[role='row']")!;
    expect(childRow.querySelector("s-checkbox")).toBeNull();
    expect(childRow).not.toHaveAttribute("aria-selected");
    // The empty cell keeps the columns aligned.
    expect(childRow.children).toHaveLength(
      container.querySelector(".cx-it__row--head")!.children.length,
    );
  });
});
