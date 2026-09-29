import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { Filters } from "./Filters";
import { Tabs } from "../Tabs";

describe("Filters", () => {
  it("renders custom text input with placeholder and queryValue", () => {
    render(
      <Filters
        queryValue="test product"
        queryPlaceholder="Search products..."
        onQueryChange={() => {}}
      />,
    );

    const inputEl = document.querySelector('input[type="text"]');
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveValue("test product");
  });

  it("fires onQueryChange on text typing", () => {
    const onQueryChange = vi.fn();

    render(
      <Filters
        queryValue=""
        onQueryChange={onQueryChange}
      />,
    );

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.change(inputEl, { target: { value: "headphones" } });
    expect(onQueryChange).toHaveBeenCalledWith("headphones");
  });

  it("opens filter dropdown on focus and shows filter items", () => {
    render(
      <Filters
        filters={[
          { key: "vendor", label: "Vendor" },
          { key: "status", label: "Status" },
        ]}
      />,
    );

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.focus(inputEl);

    expect(document.body.textContent).toContain("Vendor");
    expect(document.body.textContent).toContain("Status");
  });

  it("adds tag and triggers callback when category is clicked", () => {
    const onAddFilter = vi.fn();

    render(
      <Filters
        filters={[
          {
            key: "tag",
            label: "Tag",
            options: [
              { label: "badge-25% OFF", value: "badge-25" },
              { label: "exclude_search", value: "exclude_search" },
            ],
            operators: [
              { label: "Is", value: "is" },
              { label: "Is not", value: "is_not" },
            ],
          },
        ]}
        onAddFilter={onAddFilter}
      />,
    );

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.focus(inputEl);

    // Click on "Tag"
    const tagCategory = document.querySelector('s-clickable[accessibilitylabel="Tag"]')!;
    fireEvent.click(tagCategory);

    expect(onAddFilter).toHaveBeenCalledWith("tag");
  });

  it("automatically opens Popover 2 (value choice list) when category is selected from Popover 1", () => {
    const filters = [
      {
        key: "vendor",
        label: "Vendor",
        options: [
          { label: "Apple", value: "apple" },
          { label: "Sony", value: "sony" },
        ],
        operators: [
          { label: "Is", value: "is" },
          { label: "Is not", value: "is_not" },
        ],
      },
    ];

    function TestWrapper() {
      const [applied, setApplied] = React.useState<any[]>([]);
      return (
        <Filters
          filters={filters}
          appliedFilters={applied}
          onAddFilter={(key) => {
            setApplied([
              {
                key,
                field: "Vendor",
                operator: "is",
                value: [],
                onRemove: () => setApplied([]),
              },
            ]);
          }}
        />
      );
    }

    render(<TestWrapper />);

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.focus(inputEl);

    // Popover 1 is open showing "Vendor"
    expect(document.body.textContent).toContain("Filters");
    const vendorCategory = document.querySelector('s-clickable[accessibilitylabel="Vendor"]')!;
    fireEvent.click(vendorCategory);

    // Popover 1 closes, and Popover 2 for Vendor automatically opens with choices and operators
    expect(document.body.textContent).toContain("Apple");
    expect(document.body.textContent).toContain("Sony");
    expect(document.body.textContent).toContain("Is not");
  });

  it("opens operator and value popovers when clicking tag segments", () => {
    const onOperatorChange = vi.fn();
    const onFilterSelect = vi.fn();

    render(
      <Filters
        filters={[
          {
            key: "vendor",
            label: "Vendor",
            allowMultiple: false,
            options: [{ label: "Apple", value: "apple" }],
            operators: [
              { label: "Is", value: "is" },
              { label: "Is not", value: "is_not" },
            ],
          },
        ]}
        appliedFilters={[
          {
            key: "vendor",
            label: "apple",
            field: "Vendor",
            operator: "is",
            value: "apple",
            onRemove: () => {},
          },
        ]}
        onOperatorChange={onOperatorChange}
        onFilterSelect={onFilterSelect}
      />,
    );

    // Click operator segment (Vendor is)
    const operatorSegment = screen.getByText("is").closest("div");
    fireEvent.click(operatorSegment!);

    expect(document.body.textContent).toContain("Is not");
    const isNotOption = document.querySelector('s-clickable[accessibilitylabel="Is not"]')!;
    fireEvent.click(isNotOption);
    expect(onOperatorChange).toHaveBeenCalledWith("vendor", "is_not");

    // Click value segment (apple)
    const valueSegment = screen.getByText("apple").closest("div");
    fireEvent.click(valueSegment!);

    expect(document.body.textContent).toContain("Apple");
    const appleOption = document.querySelector('s-choice[value="apple"]')!;
    fireEvent.click(appleOption);
    expect(onFilterSelect).toHaveBeenCalledWith("vendor", "apple", "is");
  });

  it("supports multiple select by default on choice filters", () => {
    const onFilterSelect = vi.fn();
    render(
      <Filters
        filters={[
          {
            key: "vendor",
            label: "Vendor",
            options: [
              { label: "Apple", value: "apple" },
              { label: "Google", value: "google" },
            ],
          },
        ]}
        appliedFilters={[
          {
            key: "vendor",
            label: "apple",
            field: "Vendor",
            operator: "is",
            value: "apple",
            onRemove: () => {},
          },
        ]}
        onFilterSelect={onFilterSelect}
      />,
    );

    const valueSegment = screen.getByText("apple").closest("div");
    fireEvent.click(valueSegment!);

    const googleOption = document.querySelector('s-choice[value="google"]')!;
    fireEvent.click(googleOption);
    expect(onFilterSelect).toHaveBeenCalledWith("vendor", ["apple", "google"], "is");
  });

  it("renders applied filter pills and handles removal", () => {
    const onRemove = vi.fn();

    render(
      <Filters
        appliedFilters={[
          {
            key: "vendor",
            label: "apple",
            field: "Vendor",
            operator: "is",
            onRemove,
          },
        ]}
      />,
    );

    const removeButton = document.querySelector('[aria-label="Remove Vendor filter"]');
    expect(removeButton).toBeInTheDocument();

    fireEvent.click(removeButton!);
    expect(onRemove).toHaveBeenCalledWith("vendor");
  });

  it("renders Tabs compact inside Filters.SearchField", () => {
    render(
      <Filters>
        <Filters.SearchField
          tabs={
            <Tabs
              compact
              tabs={[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
              ]}
              selected="all"
            />
          }
        />
      </Filters>,
    );

    const viewTrigger = document.querySelector('s-clickable[accessibilitylabel="All"]');
    expect(viewTrigger).toBeInTheDocument();
    expect(viewTrigger?.textContent).toContain("All");
  });

  it("supports leftSlot and views alias slots inside Filters.SearchField", () => {
    const { rerender } = render(
      <Filters>
        <Filters.SearchField leftSlot={<span data-testid="slot-content">Left Slot</span>} />
      </Filters>,
    );
    expect(screen.getByTestId("slot-content")).toHaveTextContent("Left Slot");

    rerender(
      <Filters>
        <Filters.SearchField views={<span data-testid="slot-content">Views Slot</span>} />
      </Filters>,
    );
    expect(screen.getByTestId("slot-content")).toHaveTextContent("Views Slot");
  });

  it("renders Columns & Sort popover trigger and content", () => {
    render(
      <Filters
        sortOptions={[{ label: "Created", value: "created" }]}
        sortValue="created"
        hideArchived={false}
        columns={[
          { key: "status", label: "Status", visible: true },
          { key: "inventory", label: "Inventory", visible: false },
        ]}
      />,
    );

    const colsTrigger = document.querySelector('s-clickable[accessibilitylabel="Columns and sort settings"]');
    expect(colsTrigger).toBeInTheDocument();

    const popoverEl = document.querySelector("s-popover");
    expect(popoverEl).toBeInTheDocument();
    expect(popoverEl?.textContent).toContain("Columns");
    expect(popoverEl?.textContent).toContain("Status");
    expect(popoverEl?.textContent).toContain("Inventory");
  });

  it("renders Clear (X) button when query or applied filters exist", () => {
    const onClearAll = vi.fn();

    render(
      <Filters
        appliedFilters={[{ key: "vendor", label: "Apple", onRemove: () => {} }]}
        onClearAll={onClearAll}
      />,
    );

    const clearButton = document.querySelector('s-clickable[accessibilitylabel="Clear search and filters"]');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton!);
    expect(onClearAll).toHaveBeenCalled();
  });

  it("closes the dropdown when clicking the close (X) button", () => {
    render(
      <Filters
        filters={[
          { key: "vendor", label: "Vendor" },
          { key: "status", label: "Status" },
        ]}
      />,
    );

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.focus(inputEl);
    expect(document.body.textContent).toContain("Vendor");

    const closeBtn = document.querySelector('s-clickable[accessibilitylabel="Close filters popup"]')!;
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);

    expect(document.body.textContent).not.toContain("Filters");
  });

  it("closes the dropdown when pressing Escape key", () => {
    render(
      <Filters
        filters={[
          { key: "vendor", label: "Vendor" },
          { key: "status", label: "Status" },
        ]}
      />,
    );

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.focus(inputEl);
    expect(document.body.textContent).toContain("Vendor");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.body.textContent).not.toContain("Filters");
  });

  it("supports composable children inside Filters without wrapping outside content", () => {
    render(
      <Filters>
        <Filters.SearchField
          queryValue="composed query"
          onQueryChange={() => {}}
        />
        <Filters.Actions>
          <button type="button">Custom Action</button>
        </Filters.Actions>
      </Filters>,
    );

    const inputEl = document.querySelector('input[type="text"]');
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveValue("composed query");
    expect(document.body.textContent).toContain("Custom Action");
  });

  it("supports ref handle open, close, toggle and isOpen on FilterPortalPopover", () => {
    const popoverRef = React.createRef<any>();

    render(
      <Filters.Popover
        ref={popoverRef}
        trigger={<button type="button">Filter Trigger</button>}
      >
        <div>Ref Filter Body</div>
      </Filters.Popover>,
    );

    expect(popoverRef.current).toBeDefined();
    expect(popoverRef.current.isOpen()).toBe(false);
    expect(document.body.textContent).not.toContain("Ref Filter Body");

    // Open via ref
    act(() => {
      popoverRef.current.open();
    });
    expect(popoverRef.current.isOpen()).toBe(true);
    expect(document.body.textContent).toContain("Ref Filter Body");

    // Close via ref
    act(() => {
      popoverRef.current.close();
    });
    expect(popoverRef.current.isOpen()).toBe(false);
    expect(document.body.textContent).not.toContain("Ref Filter Body");

    // Toggle via ref
    act(() => {
      popoverRef.current.toggle();
    });
    expect(popoverRef.current.isOpen()).toBe(true);
    expect(document.body.textContent).toContain("Ref Filter Body");

    act(() => {
      popoverRef.current.toggle();
    });
    expect(popoverRef.current.isOpen()).toBe(false);
    expect(document.body.textContent).not.toContain("Ref Filter Body");
  });


  it("supports opening and closing FilterPortalPopover via trigger click", () => {
    render(
      <Filters.Popover
        trigger={<button type="button">Click Me</button>}
      >
        <div>Trigger Content</div>
      </Filters.Popover>,
    );

    const triggerBtn = screen.getByText("Click Me");
    expect(document.body.textContent).not.toContain("Trigger Content");

    // Click to open
    fireEvent.click(triggerBtn);
    expect(document.body.textContent).toContain("Trigger Content");

    // Click to close
    fireEvent.click(triggerBtn);
    expect(document.body.textContent).not.toContain("Trigger Content");
  });
});

