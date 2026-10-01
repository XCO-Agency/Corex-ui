import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ActionList } from "./ActionList";

describe("ActionList", () => {
  it("renders one clickable per item", () => {
    const { container } = render(
      <ActionList items={[{ content: "Edit" }, { content: "Duplicate" }]} />,
    );

    expect(container.querySelectorAll("s-clickable")).toHaveLength(2);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("calls onAction on click", () => {
    const onAction = vi.fn();
    const { container } = render(<ActionList items={[{ content: "Edit", onAction }]} />);

    fireEvent.click(container.querySelector("s-clickable")!);

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders an item with a url as a link", () => {
    const { container } = render(
      <ActionList items={[{ content: "Open", url: "/orders/1" }]} />,
    );

    expect(container.querySelector("s-clickable")).toHaveAttribute("href", "/orders/1");
  });

  it("gives a destructive item a critical tone", () => {
    const { container } = render(
      <ActionList items={[{ content: "Delete", destructive: true, icon: "delete" }]} />,
    );

    expect(container.querySelector("s-text")).toHaveAttribute("tone", "critical");
    expect(container.querySelector("s-icon")).toHaveAttribute("tone", "critical");
  });

  it("renders help text under the label", () => {
    render(<ActionList items={[{ content: "Archive", helpText: "Hides the order" }]} />);

    expect(screen.getByText("Hides the order")).toBeInTheDocument();
  });

  it("groups sections under their titles", () => {
    const { container } = render(
      <ActionList
        sections={[
          { title: "Manage", items: [{ content: "Edit" }] },
          { title: "Danger", items: [{ content: "Delete", destructive: true }] },
        ]}
      />,
    );

    expect(screen.getByText("Manage")).toBeInTheDocument();
    expect(screen.getByText("Danger")).toBeInTheDocument();
    expect(container.querySelectorAll("s-clickable")).toHaveLength(2);
  });

  it("marks the active item", () => {
    const { container } = render(
      <ActionList items={[{ content: "Newest", active: true }, { content: "Oldest" }]} />,
    );
    const [first, second] = Array.from(container.querySelectorAll("s-clickable"));

    expect(first).toHaveAttribute("background", "subdued");
    expect(second).not.toHaveAttribute("background");
  });
});
