import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "all", label: "All" },
  { id: "drafts", label: "Drafts" },
];

describe("Tabs", () => {
  it("renders tabs and panel content", () => {
    render(
      <Tabs tabs={tabs} selected={0}>
        <span>Panel content</span>
      </Tabs>,
    );
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Drafts")).toBeInTheDocument();
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("applies strong background to the selected tab", () => {
    render(<Tabs tabs={tabs} selected={0} />);
    const allTab = screen.getByText("All").closest("s-clickable");
    const draftsTab = screen.getByText("Drafts").closest("s-clickable");

    expect(allTab).toHaveAttribute("background", "strong");
    expect(draftsTab).toHaveAttribute("background", "transparent");
  });

  it("calls onSelect with the clicked tab's index", () => {
    const onSelect = vi.fn();
    render(<Tabs tabs={tabs} selected={0} onSelect={onSelect} />);

    screen.getByText("Drafts").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("does not call onSelect when clicking a disabled tab", () => {
    const onSelect = vi.fn();
    const disabledTabs = [
      { id: "all", label: "All" },
      { id: "archived", label: "Archived", disabled: true },
    ];
    render(<Tabs tabs={disabledTabs} selected={0} onSelect={onSelect} />);

    screen.getByText("Archived").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders badge, tooltip, and rightSide content", () => {
    const extendedTabs = [
      { id: "orders", label: "Orders", badge: 5, tooltip: "View orders" },
      { id: "products", label: "Products" },
    ];
    render(
      <Tabs
        tabs={extendedTabs}
        selected={0}
        rightSide={<button type="button">Action</button>}
      />,
    );

    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
