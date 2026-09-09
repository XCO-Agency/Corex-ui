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
    expect(draftsTab).toHaveAttribute("background", "subdued");
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

  it("applies strong background to the selected tab when using value prop by id", () => {
    render(<Tabs tabs={tabs} value="drafts" />);
    const allTab = screen.getByText("All").closest("s-clickable");
    const draftsTab = screen.getByText("Drafts").closest("s-clickable");

    expect(allTab).toHaveAttribute("background", "subdued");
    expect(draftsTab).toHaveAttribute("background", "strong");
  });

  it("calls onChange with the clicked tab id", () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} value="all" onChange={onChange} />);

    screen.getByText("Drafts").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("drafts");
  });

  it("supports numeric tab ids with value and onChange", () => {
    const numericTabs = [
      { id: 10, label: "Tab 10" },
      { id: 20, label: "Tab 20" },
    ];
    const onChange = vi.fn();
    render(<Tabs tabs={numericTabs} value={10} onChange={onChange} />);

    const tab10 = screen.getByText("Tab 10").closest("s-clickable");
    const tab20 = screen.getByText("Tab 20").closest("s-clickable");
    expect(tab10).toHaveAttribute("background", "strong");
    expect(tab20).toHaveAttribute("background", "subdued");

    screen.getByText("Tab 20").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(20);
  });

  it("calls both onSelect and onChange when both are provided", () => {
    const onSelect = vi.fn();
    const onChange = vi.fn();
    render(
      <Tabs
        tabs={tabs}
        selected={0}
        value="all"
        onSelect={onSelect}
        onChange={onChange}
      />,
    );

    screen.getByText("Drafts").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(onChange).toHaveBeenCalledWith("drafts");
  });

  it("does not call onChange when clicking a disabled tab", () => {
    const onChange = vi.fn();
    const disabledTabs = [
      { id: "all", label: "All" },
      { id: "archived", label: "Archived", disabled: true },
    ];
    render(<Tabs tabs={disabledTabs} value="all" onChange={onChange} />);

    screen.getByText("Archived").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders no selected tab when value is null", () => {
    render(<Tabs tabs={tabs} value={null} />);
    const allTab = screen.getByText("All").closest("s-clickable");
    const draftsTab = screen.getByText("Drafts").closest("s-clickable");

    expect(allTab).toHaveAttribute("background", "subdued");
    expect(draftsTab).toHaveAttribute("background", "subdued");
  });
});
