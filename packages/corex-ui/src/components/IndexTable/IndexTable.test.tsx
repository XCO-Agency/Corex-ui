import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { IndexTable } from "./IndexTable";

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
});
