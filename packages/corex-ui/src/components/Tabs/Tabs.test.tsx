import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "all", content: "All" },
  { id: "drafts", content: "Drafts" },
];

describe("Tabs", () => {
  it("supports uncontrolled selection, defaulting to the first tab", () => {
    render(
      <Tabs tabs={tabs}>
        <span>Panel content</span>
      </Tabs>,
    );
    expect(screen.getByText("All")).toHaveAttribute("pressed");
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("calls onSelect with the clicked tab's index in controlled mode", () => {
    const onSelect = vi.fn();
    render(<Tabs tabs={tabs} selected={0} onSelect={onSelect} />);

    screen.getByText("Drafts").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("supports extended selectedTab and onTabChange API with string IDs", () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={tabs} selectedTab="drafts" onTabChange={onTabChange} />);

    expect(screen.getByText("Drafts")).toHaveAttribute("pressed");

    screen.getByText("All").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onTabChange).toHaveBeenCalledWith("all");
  });

  it("automatically selects first active tab when selectedTab is null", () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={tabs} selectedTab={null} onTabChange={onTabChange} />);

    expect(onTabChange).toHaveBeenCalledWith("all");
  });

  it("renders badge, label fallback, and rightSide content", () => {
    const extendedTabs = [
      { id: "orders", label: "Orders", badge: 5 },
      { id: "products", content: "Products" },
    ];
    render(
      <Tabs
        tabs={extendedTabs}
        selectedTab="orders"
        rightSide={<button type="button">Action</button>}
      />,
    );

    expect(screen.getByText("Orders (5)")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
