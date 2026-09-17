import { describe, expect, it, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
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

  it("drills down into filter options when a filter category is clicked", () => {
    const onFilterSelect = vi.fn();

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
        onFilterSelect={onFilterSelect}
      />,
    );

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.focus(inputEl);

    // Click on "Tag"
    const tagCategory = document.querySelector('s-clickable[accessibilitylabel="Tag"]')!;
    fireEvent.click(tagCategory);

    expect(document.body.textContent).toContain("exclude_search");
    expect(document.body.textContent).toContain("Is not");

    // Click on "exclude_search"
    const option = document.querySelector('s-clickable[accessibilitylabel="exclude_search"]')!;
    fireEvent.click(option);

    expect(onFilterSelect).toHaveBeenCalledWith("tag", "exclude_search", "is");
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

    const removeButton = document.querySelector('s-clickable[accessibilitylabel="Remove Vendor filter"]');
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
});
