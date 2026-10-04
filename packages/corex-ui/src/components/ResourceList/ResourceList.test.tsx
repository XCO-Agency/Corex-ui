import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ResourceItem, ResourceList } from "./ResourceList";

type OrderType = { id: string; name: string };

const orders: OrderType[] = [
  { id: "1", name: "#1001" },
  { id: "2", name: "#1002" },
];

describe("ResourceList", () => {
  it("renders each item through renderItem", () => {
    render(
      <ResourceList
        items={orders}
        renderItem={(order: OrderType, id) => (
          <ResourceItem id={id}>{order.name}</ResourceItem>
        )}
      />,
    );

    expect(screen.getByText("#1001")).toBeInTheDocument();
    expect(screen.getByText("#1002")).toBeInTheDocument();
  });

  it("passes the resolved id and index to renderItem", () => {
    const renderItem = vi.fn(() => null);
    render(<ResourceList items={orders} renderItem={renderItem} />);

    expect(renderItem).toHaveBeenNthCalledWith(1, orders[0], "1", 0);
    expect(renderItem).toHaveBeenNthCalledWith(2, orders[1], "2", 1);
  });

  it("renders the empty state instead of an empty list", () => {
    render(<ResourceList items={[]} emptyState={<span>No orders</span>} />);

    expect(screen.getByText("No orders")).toBeInTheDocument();
  });
});

describe("ResourceItem", () => {
  it("is a link when given a url", () => {
    const { container } = render(<ResourceItem url="/orders/1">#1001</ResourceItem>);

    expect(container.querySelector("s-clickable")).toHaveAttribute("href", "/orders/1");
  });

  it("calls onClick when it has no url", () => {
    const onClick = vi.fn();
    const { container } = render(<ResourceItem onClick={onClick}>#1001</ResourceItem>);

    fireEvent.click(container.querySelector("s-clickable")!);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("puts media ahead of the content", () => {
    const { container } = render(
      <ResourceItem media={<span>avatar</span>}>#1001</ResourceItem>,
    );

    expect(container.querySelector("s-clickable")!.textContent).toBe("avatar#1001");
  });
});
