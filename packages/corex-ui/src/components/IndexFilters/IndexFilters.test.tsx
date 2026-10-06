import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent, screen, act, cleanup } from "@testing-library/react";
import { IndexFilters, Filters } from "./IndexFilters";
import { Tabs } from "../Tabs";

// jsdom has no PointerEvent; without it pointer events carry no coordinates.
if (typeof window.PointerEvent === "undefined") {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
    }
  }
  (window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill;
}

const cleanupAll = () => cleanup();

describe("IndexFilters", () => {
  it("provides backwards-compatible Filters export alias", () => {
    expect(Filters).toBe(IndexFilters);
  });

  it("renders custom text input with placeholder and queryValue", () => {
    render(
      <IndexFilters
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
      <IndexFilters queryValue="" debounceDelay={0} onQueryChange={onQueryChange} />,
    );

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.change(inputEl, { target: { value: "headphones" } });
    expect(onQueryChange).toHaveBeenCalledWith("headphones");
  });

  it("debounces onQueryChange by default and flushes on Enter", () => {
    vi.useFakeTimers();
    try {
      const onQueryChange = vi.fn();
      render(<IndexFilters queryValue="" onQueryChange={onQueryChange} />);

      const inputEl = document.querySelector('input[type="text"]')!;
      fireEvent.change(inputEl, { target: { value: "head" } });
      fireEvent.change(inputEl, { target: { value: "headphones" } });
      expect(inputEl).toHaveValue("headphones");
      expect(onQueryChange).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(onQueryChange).toHaveBeenCalledTimes(1);
      expect(onQueryChange).toHaveBeenCalledWith("headphones");

      fireEvent.change(inputEl, { target: { value: "headphones pro" } });
      fireEvent.keyDown(inputEl, { key: "Enter" });
      expect(onQueryChange).toHaveBeenLastCalledWith("headphones pro");
    } finally {
      vi.useRealTimers();
    }
  });

  it("opens filter dropdown on focus and shows filter items", () => {
    render(
      <IndexFilters
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
      <IndexFilters
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

    expect(onAddFilter).toHaveBeenCalledWith("tag", 0);
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
        <IndexFilters
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
    const vendorCategory = document.querySelector(
      's-clickable[accessibilitylabel="Vendor"]',
    )!;
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
      <IndexFilters
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

    // Click operator pill segment -> opens operator popover
    const opTrigger = document.querySelector(
      's-clickable[accessibilitylabel="Vendor operator"]',
    )!;
    fireEvent.click(opTrigger);

    const isNotOption = document.querySelector(
      's-clickable[accessibilitylabel="Is not"]',
    )!;
    expect(isNotOption).toBeInTheDocument();
    fireEvent.click(isNotOption);
    expect(onOperatorChange).toHaveBeenCalledWith("vendor", "is_not");

    // Click value pill segment -> opens value popover
    const valTrigger = document.querySelector(
      's-clickable[accessibilitylabel="Vendor value"]',
    )!;
    fireEvent.click(valTrigger);

    const choiceApple = document.querySelector('s-choice[value="apple"]')!;
    expect(choiceApple).toBeInTheDocument();
  });

  it("supports multiple select by default on choice filters", () => {
    const onFilterSelect = vi.fn();

    render(
      <IndexFilters
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
            label: "Apple",
            field: "Vendor",
            operator: "is",
            value: ["apple"],
            onRemove: () => {},
          },
        ]}
        onFilterSelect={onFilterSelect}
      />,
    );

    const valTrigger = document.querySelector(
      's-clickable[accessibilitylabel="Vendor value"]',
    )!;
    fireEvent.click(valTrigger);

    const googleOption = document.querySelector('s-choice[value="google"]')!;
    fireEvent.click(googleOption);
    expect(onFilterSelect).toHaveBeenCalledWith("vendor", ["apple", "google"], "is");
  });

  it("renders applied filter pills and handles removal", () => {
    const onRemove = vi.fn();

    render(
      <IndexFilters
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

  it("renders Tabs compact inside IndexFilters.SearchField", () => {
    render(
      <IndexFilters>
        <IndexFilters.SearchField
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
      </IndexFilters>,
    );

    const viewTrigger = document.querySelector('s-clickable[accessibilitylabel="All"]');
    expect(viewTrigger).toBeInTheDocument();
    expect(viewTrigger?.textContent).toContain("All");
  });

  it("renders any content passed to the tabs slot", () => {
    render(
      <IndexFilters>
        <IndexFilters.SearchField tabs={<span data-testid="slot-content">Views</span>} />
      </IndexFilters>,
    );
    expect(screen.getByTestId("slot-content")).toHaveTextContent("Views");
  });

  describe("ViewOptions", () => {
    const baseColumns = [
      { key: "product", label: "Product", reorderable: false, hideable: false },
      { key: "status", label: "Status" },
      { key: "inventory", label: "Inventory", visible: false },
      { key: "vendor", label: "Vendor" },
    ];

    const getItems = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-corex-index-filters-column]"),
      );
    const getHandle = (label: string) =>
      document.querySelector<HTMLElement>(
        `[accessibilitylabel^="Reorder ${label} column"]`,
      )!;

    it("renders the trigger and every composed section", () => {
      render(
        <IndexFilters>
          <IndexFilters.Actions>
            <IndexFilters.ViewOptions accessibilityLabel="Columns and sort settings">
              <IndexFilters.ViewOptionsSort
                options={[{ label: "Created", value: "created" }]}
                value="created"
              />
              <IndexFilters.ViewOptionsToggles
                items={[{ key: "archived", label: "Hide archived", checked: false }]}
              />
              <IndexFilters.ViewOptionsColumns columns={baseColumns} />
            </IndexFilters.ViewOptions>
          </IndexFilters.Actions>
        </IndexFilters>,
      );

      expect(
        document.querySelector('[accessibilitylabel="Columns and sort settings"]'),
      ).toBeInTheDocument();
      const popoverEl = document.querySelector("s-popover")!;
      expect(popoverEl.textContent).toContain("Sort by");
      expect(popoverEl.textContent).toContain("Hide archived");
      expect(popoverEl.textContent).toContain("Columns");
      expect(
        getItems().map((el) => el.getAttribute("data-corex-index-filters-column")),
      ).toEqual(["product", "status", "inventory", "vendor"]);
      // A divider between each of the three sections.
      expect(popoverEl.querySelectorAll("s-divider")).toHaveLength(2);
    });

    it("reports sort changes", () => {
      const onChange = vi.fn();
      render(
        <IndexFilters.ViewOptionsSort
          options={[
            { label: "Created", value: "created" },
            { label: "Title", value: "title" },
          ]}
          value="created"
          onChange={onChange}
        />,
      );
      const select = document.querySelector("s-select") as HTMLElement & {
        value: string;
      };
      select.value = "title";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      expect(onChange).toHaveBeenCalledWith("title");
    });

    it("reports toggle changes on the item and the section", () => {
      const onItemChange = vi.fn();
      const onChange = vi.fn();
      render(
        <IndexFilters.ViewOptionsToggles
          items={[
            {
              key: "archived",
              label: "Hide archived",
              checked: false,
              onChange: onItemChange,
            },
          ]}
          onChange={onChange}
        />,
      );
      const switchEl = document.querySelector("s-switch") as HTMLElement & {
        checked: boolean;
      };
      switchEl.checked = true;
      fireEvent(switchEl, new Event("change", { bubbles: true }));
      expect(onItemChange).toHaveBeenCalledWith(true);
      expect(onChange).toHaveBeenCalledWith("archived", true);
    });

    it("toggles column visibility and returns the full list", () => {
      const onChange = vi.fn();
      render(
        <IndexFilters.ViewOptionsColumns columns={baseColumns} onChange={onChange} />,
      );

      fireEvent.click(
        document.querySelector('[accessibilitylabel="Show Inventory column"]')!,
      );
      expect(onChange).toHaveBeenCalledWith([
        baseColumns[0],
        baseColumns[1],
        { ...baseColumns[2], visible: true },
        baseColumns[3],
      ]);

      // Non-hideable columns keep their eye button disabled.
      const productToggle = document.querySelector(
        '[accessibilitylabel="Hide Product column"]',
      ) as HTMLElement & { disabled?: boolean };
      expect(productToggle.disabled).toBe(true);
    });

    it("renders no drag handle for fixed columns", () => {
      render(
        <IndexFilters.ViewOptionsColumns columns={baseColumns} onChange={() => {}} />,
      );
      expect(
        document.querySelector('[accessibilitylabel^="Reorder Product column"]'),
      ).toBeNull();
      expect(getHandle("Status")).toBeInTheDocument();
    });

    it("reorders with the arrow keys and keeps fixed columns in place", () => {
      const onChange = vi.fn();
      render(
        <IndexFilters.ViewOptionsColumns columns={baseColumns} onChange={onChange} />,
      );

      fireEvent.keyDown(getHandle("Vendor"), { key: "ArrowUp" });
      expect(onChange.mock.calls[0]![0].map((c: { key: string }) => c.key)).toEqual([
        "product",
        "status",
        "vendor",
        "inventory",
      ]);

      // Status is the first movable column: it can't jump above the fixed Product column.
      onChange.mockClear();
      fireEvent.keyDown(getHandle("Status"), { key: "ArrowUp" });
      expect(onChange).not.toHaveBeenCalled();
    });

    it("uses left/right arrows in the horizontal direction", () => {
      const onChange = vi.fn();
      render(
        <IndexFilters.ViewOptionsColumns
          columns={baseColumns}
          onChange={onChange}
          direction="horizontal"
        />,
      );
      fireEvent.keyDown(getHandle("Status"), { key: "ArrowDown" });
      expect(onChange).not.toHaveBeenCalled();
      fireEvent.keyDown(getHandle("Status"), { key: "ArrowRight" });
      expect(onChange.mock.calls[0]![0].map((c: { key: string }) => c.key)).toEqual([
        "product",
        "inventory",
        "status",
        "vendor",
      ]);
    });

    it("reorders by dragging the handle", () => {
      const onChange = vi.fn();
      render(
        <IndexFilters.ViewOptionsColumns columns={baseColumns} onChange={onChange} />,
      );

      // Stack the items 30px apart: 0, 30, 60, 90.
      getItems().forEach((item, index) => {
        item.getBoundingClientRect = () =>
          ({
            top: index * 30,
            bottom: index * 30 + 30,
            height: 30,
            left: 0,
            right: 200,
            width: 200,
          }) as DOMRect;
      });

      const handle = getHandle("Status").parentElement!;
      fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientY: 45 });
      // A floating copy follows the pointer while the original fades.
      expect(getItems()).toHaveLength(5);

      fireEvent.pointerMove(document, { pointerId: 1, clientY: 120 });
      fireEvent.pointerUp(document, { pointerId: 1, clientY: 120 });

      expect(getItems()).toHaveLength(4);
      expect(onChange.mock.calls[0]![0].map((c: { key: string }) => c.key)).toEqual([
        "product",
        "inventory",
        "vendor",
        "status",
      ]);
    });
  });

  it("renders Clear (X) button when query or applied filters exist", () => {
    const onClearAll = vi.fn();

    render(
      <IndexFilters
        appliedFilters={[{ key: "vendor", label: "Apple", onRemove: () => {} }]}
        onClearAll={onClearAll}
      />,
    );

    const clearButton = document.querySelector(
      's-clickable[accessibilitylabel="Clear search and filters"]',
    );
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton!);
    expect(onClearAll).toHaveBeenCalled();
  });

  it("closes the dropdown when clicking the close (X) button", () => {
    render(
      <IndexFilters
        filters={[
          { key: "vendor", label: "Vendor" },
          { key: "status", label: "Status" },
        ]}
      />,
    );

    const inputEl = document.querySelector('input[type="text"]')!;
    fireEvent.focus(inputEl);
    expect(document.body.textContent).toContain("Vendor");

    const closeBtn = document.querySelector(
      '[accessibilitylabel="Close filters popup"]',
    )!;
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);

    expect(document.body.textContent).not.toContain("Filters");
  });

  it("closes the dropdown when pressing Escape key", () => {
    render(
      <IndexFilters
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

  it("supports composable children inside IndexFilters without wrapping outside content", () => {
    render(
      <IndexFilters>
        <IndexFilters.SearchField queryValue="composed query" onQueryChange={() => {}} />
        <IndexFilters.Actions>
          <button type="button">Custom Action</button>
        </IndexFilters.Actions>
      </IndexFilters>,
    );

    const inputEl = document.querySelector('input[type="text"]');
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveValue("composed query");
    expect(document.body.textContent).toContain("Custom Action");
  });

  describe("save action and ViewVisibleActiveFilter", () => {
    const activeFilter = [
      { key: "vendor", field: "Vendor", operator: "is", value: "apple", onRemove: () => {} },
    ];
    const getActiveOnly = () =>
      Array.from(document.querySelectorAll("[data-corex-index-filters-active-only]"));
    const clickButton = (label: string) =>
      screen
        .getAllByText(label)
        .find((el) => el.tagName === "S-BUTTON")!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));

    it("renders the built-in save action collapsed until a filter is active", () => {
      const { rerender } = render(
        <IndexFilters>
          <IndexFilters.SearchField appliedFilters={[]} />
          <IndexFilters.Actions />
        </IndexFilters>,
      );
      expect(getActiveOnly()).toHaveLength(1);
      expect(getActiveOnly()[0]).toHaveAttribute(
        "data-corex-index-filters-active-only",
        "hidden",
      );

      rerender(
        <IndexFilters>
          <IndexFilters.SearchField appliedFilters={activeFilter} />
          <IndexFilters.Actions />
        </IndexFilters>,
      );
      expect(getActiveOnly()[0]).toHaveAttribute(
        "data-corex-index-filters-active-only",
        "visible",
      );
    });

    it("ignores filter pills without a value and counts a non-blank query", () => {
      const { rerender } = render(
        <IndexFilters appliedFilters={[{ key: "vendor", value: [], onRemove: () => {} }]} />,
      );
      expect(getActiveOnly()[0]).toHaveAttribute(
        "data-corex-index-filters-active-only",
        "hidden",
      );

      rerender(<IndexFilters queryValue="shoes" />);
      expect(getActiveOnly()[0]).toHaveAttribute(
        "data-corex-index-filters-active-only",
        "visible",
      );
    });

    it("removes the save action when saveAction is false", () => {
      render(<IndexFilters appliedFilters={activeFilter} saveAction={false} />);
      expect(getActiveOnly()).toHaveLength(0);
      expect(screen.queryByText("Save")).toBeNull();
    });

    it("keeps custom ViewVisibleActiveFilter groups separate from the save action", () => {
      render(
        <IndexFilters>
          <IndexFilters.SearchField appliedFilters={activeFilter} />
          <IndexFilters.Actions>
            <IndexFilters.ViewVisibleActiveFilter>
              <span>Export</span>
            </IndexFilters.ViewVisibleActiveFilter>
          </IndexFilters.Actions>
        </IndexFilters>,
      );
      const groups = getActiveOnly();
      expect(groups).toHaveLength(2);
      expect(groups[0]).toHaveTextContent("Export");
      expect(groups[1]).toHaveTextContent("Save");
    });

    it("renders the save action once when placed explicitly", () => {
      render(
        <IndexFilters>
          <IndexFilters.SearchField appliedFilters={activeFilter} />
          <IndexFilters.SaveAction />
          <IndexFilters.Actions>
            <span>Refresh</span>
          </IndexFilters.Actions>
        </IndexFilters>,
      );
      expect(getActiveOnly()).toHaveLength(1);
      expect(getActiveOnly()[0]).toHaveTextContent("Save");
    });

    it("renders the save action without an Actions container", () => {
      render(
        <IndexFilters>
          <IndexFilters.SearchField appliedFilters={activeFilter} />
        </IndexFilters>,
      );
      expect(getActiveOnly()).toHaveLength(1);
      expect(getActiveOnly()[0]).toHaveTextContent("Save");
    });

    it("follows hasActiveFilters and the visible override", () => {
      render(
        <IndexFilters hasActiveFilters>
          <IndexFilters.SearchField appliedFilters={[]} />
          <IndexFilters.Actions>
            <IndexFilters.ViewVisibleActiveFilter visible={false}>
              <span>Export</span>
            </IndexFilters.ViewVisibleActiveFilter>
          </IndexFilters.Actions>
        </IndexFilters>,
      );
      const [custom, save] = getActiveOnly();
      expect(custom).toHaveAttribute("data-corex-index-filters-active-only", "hidden");
      expect(save).toHaveAttribute("data-corex-index-filters-active-only", "visible");
    });

    it("asks for a name and saves the current search and filters", async () => {
      const onSaveView = vi.fn();
      render(
        <IndexFilters
          queryValue="phone"
          appliedFilters={activeFilter}
          onSaveView={onSaveView}
          saveAction={{ modalTitle: "Save as tab", saveLabel: "Create" }}
        />,
      );

      act(() => clickButton("Save"));
      expect(document.querySelector("s-modal")).toHaveAttribute("heading", "Save as tab");

      const field = document.querySelector("s-text-field") as HTMLElement & {
        value?: string;
      };
      act(() => {
        field.value = "  Apple phones ";
        field.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await act(async () => clickButton("Create"));

      expect(onSaveView).toHaveBeenCalledWith({
        name: "Apple phones",
        query: "phone",
        filters: [{ key: "vendor", field: "Vendor", operator: "is", value: "apple" }],
      });
    });

    it("blocks the save when validateName returns an error", async () => {
      const onSaveView = vi.fn();
      render(
        <IndexFilters
          appliedFilters={activeFilter}
          onSaveView={onSaveView}
          saveAction={{ validateName: (name) => (name === "All" ? "Name taken" : undefined) }}
        />,
      );

      act(() => clickButton("Save"));
      const field = document.querySelector("s-text-field") as HTMLElement & {
        value?: string;
      };
      act(() => {
        field.value = "All";
        field.dispatchEvent(new Event("input", { bubbles: true }));
      });
      const modalSave = document.querySelector('s-modal s-button[slot="primary-action"]')!;
      await act(async () => {
        modalSave.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(onSaveView).not.toHaveBeenCalled();
      expect(field).toHaveAttribute("error", "Name taken");
    });
  });

  describe("token input behaviour", () => {
    const tokenFilters = [
      { key: "vendor", label: "Vendor", options: [{ label: "Apple", value: "apple" }] },
      { key: "tag", label: "Tag" },
      { key: "status", label: "Status" },
    ];

    function renderWithApplied(
      overrides: Partial<React.ComponentProps<typeof IndexFilters>> = {},
    ) {
      const removed: string[] = [];
      const applied = ["vendor", "tag"].map((key) => ({
        key,
        value: [] as string[],
        onRemove: (k: string) => removed.push(k),
      }));
      const onAddFilter = vi.fn();
      render(
        <IndexFilters
          filters={tokenFilters}
          appliedFilters={applied}
          onAddFilter={onAddFilter}
          debounceDelay={0}
          {...overrides}
        />,
      );
      const input = document.querySelector<HTMLInputElement>(
        'input[type="text"][aria-label]:not([aria-label="Search filters"])',
      )!;
      return { removed, onAddFilter, input };
    }

    it("removes the previous pill on Backspace at the start of the input", () => {
      const { removed, input } = renderWithApplied();
      fireEvent.focus(input);
      input.setSelectionRange(0, 0);
      fireEvent.keyDown(input, { key: "Backspace" });
      expect(removed).toEqual(["tag"]);
    });

    it("keeps normal Backspace behaviour inside keyword text", () => {
      const { removed, input } = renderWithApplied({ queryValue: "shoes" });
      fireEvent.focus(input);
      input.setSelectionRange(5, 5);
      fireEvent.keyDown(input, { key: "Backspace" });
      expect(removed).toEqual([]);
    });

    it("moves the caret between pills and inserts the new filter at that position", () => {
      const { onAddFilter, removed, input } = renderWithApplied();
      fireEvent.focus(input);
      input.setSelectionRange(0, 0);
      fireEvent.keyDown(input, { key: "ArrowLeft" });

      const gap = document.querySelector<HTMLInputElement>(
        'input[aria-label="Search filters"]',
      )!;
      expect(gap).toBeInTheDocument();
      expect(document.body.textContent).toContain("Status");

      fireEvent.click(
        document.querySelector('s-clickable[accessibilitylabel="Status"]')!,
      );
      expect(onAddFilter).toHaveBeenCalledWith("status", 1);
      expect(removed).toEqual([]);
    });

    it("removes the pill before the caret on Backspace from a gap", () => {
      const { removed, input } = renderWithApplied();
      fireEvent.focus(input);
      input.setSelectionRange(0, 0);
      fireEvent.keyDown(input, { key: "ArrowLeft" });
      const gap = document.querySelector<HTMLInputElement>(
        'input[aria-label="Search filters"]',
      )!;
      fireEvent.keyDown(gap, { key: "Backspace" });
      expect(removed).toEqual(["vendor"]);
    });

    it("narrows the filters list with text typed between pills", () => {
      const { input } = renderWithApplied({ appliedFilters: [] });
      fireEvent.focus(input);
      expect(document.body.textContent).toContain("Vendor");
      cleanupAll();

      const r = renderWithApplied();
      fireEvent.focus(r.input);
      r.input.setSelectionRange(0, 0);
      fireEvent.keyDown(r.input, { key: "ArrowLeft" });
      const gap = document.querySelector<HTMLInputElement>(
        'input[aria-label="Search filters"]',
      )!;
      fireEvent.change(gap, { target: { value: "zzz" } });
      expect(document.body.textContent).toContain("No matching filters");
    });

    it("keeps the filters popover open while typing keyword text", () => {
      const { input } = renderWithApplied({ queryValue: "shoes" });
      input.setSelectionRange(3, 3);
      fireEvent.focus(input);
      expect(document.body.textContent).toContain("Status");

      fireEvent.change(input, { target: { value: "shoes red" } });
      expect(document.body.textContent).toContain("Status");
    });

    it("submits the keyword search on Enter instead of picking a filter", () => {
      const onQueryChange = vi.fn();
      const { input, onAddFilter } = renderWithApplied({ onQueryChange });
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "shoes" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onAddFilter).not.toHaveBeenCalled();
      expect(onQueryChange).toHaveBeenLastCalledWith("shoes");

      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onAddFilter).toHaveBeenCalledWith("status", 2);
    });

    it("renders the + button after the pills", () => {
      renderWithApplied();
      const addButton = document.querySelector(
        's-clickable[accessibilitylabel="Add filter"]',
      )!;
      const lastChip = document.querySelector('[data-corex-index-filters-chip="1"]')!;
      expect(
        lastChip.compareDocumentPosition(addButton) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it("reveals the remove button only while the pill is hovered", () => {
      renderWithApplied();
      const chip = document.querySelector<HTMLElement>(
        '[data-corex-index-filters-chip="0"]',
      )!;
      const removeWrapper = chip
        .querySelector('[aria-label="Remove Vendor filter"]')!
        .closest('[style*="max-width"]') as HTMLElement;
      expect(parseFloat(removeWrapper.style.maxWidth)).toBe(0);

      fireEvent.mouseEnter(chip);
      expect(parseFloat(removeWrapper.style.maxWidth)).toBe(32);

      fireEvent.mouseLeave(chip);
      expect(parseFloat(removeWrapper.style.maxWidth)).toBe(0);
    });

    it("shows the + button only while the field is not focused", () => {
      const { input } = renderWithApplied({ appliedFilters: [] });
      const addButton = document.querySelector(
        's-clickable[accessibilitylabel="Add filter"]',
      )!;
      expect(addButton).toBeInTheDocument();

      fireEvent.click(addButton);
      expect(document.activeElement).toBe(input);
      expect(document.body.textContent).toContain("Vendor");
      expect(
        document.querySelector('s-clickable[accessibilitylabel="Add filter"]'),
      ).not.toBeInTheDocument();
    });

    it("ignores mouse down inside a pill popover (portal bubbling)", () => {
      renderWithApplied();
      fireEvent.click(
        document.querySelector('s-clickable[accessibilitylabel="Vendor value"]')!,
      );
      const choice = document.querySelector('s-choice[value="apple"]')!;
      expect(choice).toBeInTheDocument();

      fireEvent.mouseDown(choice);
      expect(document.querySelector('input[aria-label="Search filters"]')).toBeNull();
      expect(document.querySelector('s-choice[value="apple"]')).toBeInTheDocument();
    });

    it("scrolls pills horizontally and fades the overflowing edges", () => {
      renderWithApplied();
      const region = document.querySelector<HTMLElement>(".corex-index-filters-scroll")!;
      expect(region.style.overflowX).toBe("auto");
      expect(region.style.flexWrap).toBe("nowrap");
      expect(region.style.maskImage ?? "").toBe("");

      Object.defineProperty(region, "scrollWidth", { configurable: true, value: 600 });
      Object.defineProperty(region, "clientWidth", { configurable: true, value: 200 });

      region.scrollLeft = 0;
      fireEvent.scroll(region);
      const atStart = region.getAttribute("style") ?? "";
      expect(atStart).toContain("linear-gradient(to right, #000 0");
      expect(atStart).toContain("transparent 100%");

      region.scrollLeft = 200;
      fireEvent.scroll(region);
      const inMiddle = region.getAttribute("style") ?? "";
      expect(inMiddle).toContain("linear-gradient(to right, transparent 0");
      expect(inMiddle).toContain("transparent 100%");

      region.scrollLeft = 400;
      fireEvent.scroll(region);
      const atEnd = region.getAttribute("style") ?? "";
      expect(atEnd).toContain("linear-gradient(to right, transparent 0");
      expect(atEnd).toContain("#000 100%");
    });

    it("keeps the + button mounted when it receives focus on mouse down", () => {
      renderWithApplied();
      const addButton = document.querySelector(
        's-clickable[accessibilitylabel="Add filter"]',
      )!;
      fireEvent.focus(addButton);
      expect(
        document.querySelector('s-clickable[accessibilitylabel="Add filter"]'),
      ).toBeInTheDocument();
    });

    it("collapses more than three values into '+ n more'", () => {
      render(
        <IndexFilters
          filters={[{ key: "tag", label: "Tag" }]}
          appliedFilters={[
            { key: "tag", value: ["a", "b", "c", "d", "e"], onRemove: () => {} },
          ]}
        />,
      );
      expect(screen.getByText("a, b, c + 2 more")).toBeInTheDocument();
    });
  });
});
