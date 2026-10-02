import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Table } from "./Table";
import { useState } from "react";

function TestTable() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["cart-1"]));

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Table variant="auto">
      <Table.HeaderRow>
        <Table.Header listSlot="primary">Cart</Table.Header>
        <Table.Header format="numeric">Visitors</Table.Header>
        <Table.Header format="currency">Total</Table.Header>
      </Table.HeaderRow>
      <Table.Body>
        <Table.Row clickDelegate="click-cart-1">
          <Table.Cell>
            <Table.ExpandButton
              expanded={expanded.has("cart-1")}
              onToggle={() => toggle("cart-1")}
            />
            <span>Black Friday Cart</span>
          </Table.Cell>
          <Table.Cell>14,820</Table.Cell>
          <Table.Cell>$61,420</Table.Cell>
        </Table.Row>

        {expanded.has("cart-1") && (
          <Table.Row key="v-1a">
            <Table.Cell>
              <Table.SubRowConnector isLast={false} />
              <span>Variant A</span>
            </Table.Cell>
            <Table.Cell>7,410</Table.Cell>
            <Table.Cell>$34,280</Table.Cell>
          </Table.Row>
        )}

        <Table.Row clickDelegate="click-cart-2">
          <Table.Cell>
            <span>Default Cart</span>
          </Table.Cell>
          <Table.Cell>8,340</Table.Cell>
          <Table.Cell>$24,010</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}

describe("Table compound component", () => {
  it("renders s-table elements cleanly", () => {
    const { container } = render(<TestTable />);

    expect(container.querySelector("s-table")).toBeInTheDocument();
    expect(container.querySelector("s-table-header-row")).toBeInTheDocument();
    expect(container.querySelector("s-table-body")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Visitors")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Black Friday Cart")).toBeInTheDocument();
    expect(screen.getByText("Variant A")).toBeInTheDocument();
    expect(screen.getByText("Default Cart")).toBeInTheDocument();
  });

  it("toggles sub-rows on expand button click", () => {
    const { container } = render(<TestTable />);

    // Initially Variant A is visible (default expanded)
    expect(screen.getByText("Variant A")).toBeInTheDocument();

    // Click collapse
    const button = container.querySelector("s-button")!;
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("icon", "chevron-down");
    fireEvent.click(button);

    // Variant A should now be removed
    expect(screen.queryByText("Variant A")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("icon", "chevron-right");

    // Click expand again
    fireEvent.click(button);
    expect(screen.getByText("Variant A")).toBeInTheDocument();
    expect(button).toHaveAttribute("icon", "chevron-down");
  });

  it("renders a header cell per column inside the header row, with no section wrapper", () => {
    const { container } = render(
      <Table>
        <Table.HeaderRow>
          <Table.HeaderCell>Order</Table.HeaderCell>
          <Table.HeaderCell>Customer</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          <Table.Row>
            <Table.Cell>#1001</Table.Cell>
            <Table.Cell>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    const headerRow = container.querySelector("s-table-header-row")!;
    expect(headerRow.parentElement?.tagName.toLowerCase()).toBe("s-table");
    expect(headerRow.querySelectorAll("s-table-header")).toHaveLength(2);
    // One `Text` per header cell, never nested.
    expect(headerRow.querySelectorAll("s-text s-text")).toHaveLength(0);
  });

  it("keeps Table.Header as an alias of Table.HeaderCell", () => {
    expect(Table.Header).toBe(Table.HeaderCell);
  });
});
