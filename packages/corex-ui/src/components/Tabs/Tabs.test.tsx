import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "all", label: "All" },
  { id: "drafts", label: "Drafts" },
];

function getTab(label: string) {
  return screen.getByRole("tab", { name: label });
}

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

  it("marks the selected tab with aria-selected", () => {
    render(<Tabs tabs={tabs} selected={0} />);

    expect(getTab("All")).toHaveAttribute("aria-selected", "true");
    expect(getTab("Drafts")).toHaveAttribute("aria-selected", "false");
  });

  it("calls onSelect with the clicked tab's index", () => {
    const onSelect = vi.fn();
    render(<Tabs tabs={tabs} selected={0} onSelect={onSelect} />);

    getTab("Drafts").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("does not call onSelect when clicking a disabled tab", () => {
    const onSelect = vi.fn();
    const disabledTabs = [
      { id: "all", label: "All" },
      { id: "archived", label: "Archived", disabled: true },
    ];
    render(<Tabs tabs={disabledTabs} selected={0} onSelect={onSelect} />);

    getTab("Archived").dispatchEvent(new MouseEvent("click", { bubbles: true }));

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

  it("marks the selected tab when using value prop by id", () => {
    render(<Tabs tabs={tabs} value="drafts" />);

    expect(getTab("All")).toHaveAttribute("aria-selected", "false");
    expect(getTab("Drafts")).toHaveAttribute("aria-selected", "true");
  });

  it("calls onChange with the clicked tab id", () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} value="all" onChange={onChange} />);

    getTab("Drafts").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("drafts");
  });

  it("supports numeric tab ids with value and onChange", () => {
    const numericTabs = [
      { id: 10, label: "Tab 10" },
      { id: 20, label: "Tab 20" },
    ];
    const onChange = vi.fn();
    render(<Tabs tabs={numericTabs} value={10} onChange={onChange} />);

    expect(getTab("Tab 10")).toHaveAttribute("aria-selected", "true");
    expect(getTab("Tab 20")).toHaveAttribute("aria-selected", "false");

    getTab("Tab 20").dispatchEvent(new MouseEvent("click", { bubbles: true }));
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

    getTab("Drafts").dispatchEvent(new MouseEvent("click", { bubbles: true }));

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

    getTab("Archived").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders no selected tab when value is null", () => {
    render(<Tabs tabs={tabs} value={null} />);

    expect(getTab("All")).toHaveAttribute("aria-selected", "false");
    expect(getTab("Drafts")).toHaveAttribute("aria-selected", "false");
  });

  it("supports union literal id types with selected and onSelect passing tab ID", () => {
    type DrawerTab = "cart" | "saved" | "upsells";
    const drawerTabs: { id: DrawerTab; label: string }[] = [
      { id: "cart", label: "Cart" },
      { id: "saved", label: "Saved" },
      { id: "upsells", label: "Upsells" },
    ];
    const onSelect = vi.fn();
    const onChange = vi.fn();

    render(
      <Tabs tabs={drawerTabs} selected="cart" onSelect={onSelect} onChange={onChange} />,
    );

    getTab("Saved").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onSelect).toHaveBeenCalledWith("saved", 1);
    expect(onChange).toHaveBeenCalledWith("saved");
  });

  it("renders a segment-style track", () => {
    const { container } = render(<Tabs tabs={tabs} value="all" />);
    expect(container.querySelector('[data-slot="tabs-track"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs-thumb"]')).toBeInTheDocument();
  });

  describe("compact mode", () => {
    it("renders a fully rounded compact trigger with selected tab label", () => {
      const { container } = render(<Tabs tabs={tabs} value="all" compact />);

      const popoverEl = document.querySelector("s-popover");
      expect(popoverEl).toBeInTheDocument();

      expect(container.querySelector('[data-slot="tabs-compact"]')).toBeInTheDocument();

      const trigger = document.querySelector(
        's-clickable[commandfor^="corex-tabs-popover"]',
      );
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("accessibilitylabel", "All");
      expect(trigger).toHaveAttribute("borderradius", "max");

      const selectIcon = document.querySelector('s-icon[type="select"]');
      expect(selectIcon).toBeInTheDocument();
    });

    it("renders dropdown menu items and checkmark for selected tab", () => {
      render(<Tabs tabs={tabs} value="all" compact />);

      const popoverEl = document.querySelector("s-popover");
      expect(popoverEl).toBeInTheDocument();

      const checkIcon = popoverEl?.querySelector('s-icon[type="check"]');
      expect(checkIcon).toBeInTheDocument();

      expect(screen.getAllByText("All").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Drafts").length).toBeGreaterThanOrEqual(1);
    });

    it("calls onSelect and onChange when clicking a tab in the compact dropdown", () => {
      const onSelect = vi.fn();
      const onChange = vi.fn();

      render(
        <Tabs
          tabs={tabs}
          value="all"
          selected={0}
          onSelect={onSelect}
          onChange={onChange}
          compact
        />,
      );

      const popoverEl = document.querySelector("s-popover");
      const draftsItem = popoverEl?.querySelector(
        's-clickable[accessibilitylabel="Drafts"]',
      );
      expect(draftsItem).toBeInTheDocument();

      draftsItem?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(onSelect).toHaveBeenCalledWith(1);
      expect(onChange).toHaveBeenCalledWith("drafts");
    });

    it("does not call onSelect or onChange when clicking a disabled tab in compact dropdown", () => {
      const onSelect = vi.fn();
      const onChange = vi.fn();
      const tabsWithDisabled = [
        { id: "all", label: "All" },
        { id: "archived", label: "Archived", disabled: true },
      ];

      render(
        <Tabs
          tabs={tabsWithDisabled}
          value="all"
          onSelect={onSelect}
          onChange={onChange}
          compact
        />,
      );

      const popoverEl = document.querySelector("s-popover");
      const archivedItem = popoverEl?.querySelector(
        's-clickable[accessibilitylabel="Archived"]',
      );
      expect(archivedItem).toBeInTheDocument();

      archivedItem?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(onSelect).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });

    it("renders badge in compact mode", () => {
      const richTabs = [
        {
          id: "all",
          label: "All",
          badge: 42,
        },
        { id: "active", label: "Active" },
      ];

      render(<Tabs tabs={richTabs} value="all" compact />);

      expect(screen.getAllByText("42").length).toBeGreaterThanOrEqual(1);
    });

    it("renders rightSide alongside the compact trigger", () => {
      render(
        <Tabs
          tabs={tabs}
          value="all"
          compact
          rightSide={<button type="button">Filter</button>}
        />,
      );

      expect(screen.getByText("Filter")).toBeInTheDocument();
    });
  });
});
