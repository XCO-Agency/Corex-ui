import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { IndexFilters } from "./IndexFilters";
import { IndexFiltersMode } from "./IndexFilters.types";
import { useSetIndexFiltersMode } from "./useSetIndexFiltersMode";
import { act, renderHook } from "@testing-library/react";

describe("IndexFilters", () => {
  it("renders the filter toolbar with its search input", () => {
    const { container } = render(
      <IndexFilters queryValue="" queryPlaceholder="Search orders" />,
    );
    const input = container.querySelector("input")!;

    expect(input).toHaveAttribute("placeholder", "Search orders");
  });

  it("renders v12 tabs as the compact view switcher", () => {
    render(
      <IndexFilters
        tabs={[
          { id: "all", content: "All" },
          { id: "open", content: "Open" },
        ]}
        selected={0}
      />,
    );

    expect(
      document.querySelector('s-clickable[accessibility-label="All"]'),
    ).not.toBeNull();
  });

  it("calls both the tab's own action and onSelect", () => {
    const onAction = vi.fn();
    const onSelect = vi.fn();
    render(
      <IndexFilters
        tabs={[
          { id: "all", content: "All" },
          { id: "open", content: "Open", onAction },
        ]}
        selected={0}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(document.querySelector('s-clickable[accessibility-label="All"]')!);
    fireEvent.click(document.querySelector('s-clickable[accessibility-label="Open"]')!);

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("renders an applied filter as a removable pill", () => {
    const onRemove = vi.fn();
    render(
      <IndexFilters
        appliedFilters={[{ key: "vendor", label: "Vendor is Acme", onRemove }]}
      />,
    );

    expect(screen.getByText("Vendor is Acme")).toBeInTheDocument();
  });

  it("flattens node labels, since the toolbar takes text", () => {
    render(
      <IndexFilters
        appliedFilters={[
          {
            key: "vendor",
            label: (
              <span>
                Vendor is <strong>Acme</strong>
              </span>
            ),
          },
        ]}
      />,
    );

    expect(screen.getByText("Vendor is Acme")).toBeInTheDocument();
  });

  it("drops the filter control when hideFilters is set", () => {
    const { unmount } = render(
      <IndexFilters filters={[{ key: "vendor", label: "Vendor" }]} />,
    );

    expect(
      document.querySelector('s-clickable[accessibility-label="Add filter"]'),
    ).not.toBeNull();
    unmount();

    render(<IndexFilters filters={[{ key: "vendor", label: "Vendor" }]} hideFilters />);

    expect(
      document.querySelector('s-clickable[accessibility-label="Add filter"]'),
    ).toBeNull();
  });

  it("maps v12's sort array onto the toolbar's single value", () => {
    const onSort = vi.fn();
    render(
      <IndexFilters
        sortOptions={[
          { value: "created_at asc", directionLabel: "Oldest first" },
          { value: "created_at desc", directionLabel: "Newest first" },
        ]}
        sortSelected={["created_at desc"]}
        onSort={onSort}
      />,
    );

    const select = document.querySelector("s-select") as HTMLElement & {
      value?: string;
    };
    expect(select.value).toBe("created_at desc");

    select.value = "created_at asc";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onSort).toHaveBeenCalledWith(["created_at asc"]);
  });
});

describe("useSetIndexFiltersMode", () => {
  it("starts in the default mode and holds whatever it is set to", () => {
    const { result } = renderHook(() => useSetIndexFiltersMode());

    expect(result.current.mode).toBe(IndexFiltersMode.Default);

    act(() => result.current.setMode(IndexFiltersMode.Filtering));
    expect(result.current.mode).toBe(IndexFiltersMode.Filtering);
  });

  it("accepts an initial mode", () => {
    const { result } = renderHook(() =>
      useSetIndexFiltersMode(IndexFiltersMode.Filtering),
    );

    expect(result.current.mode).toBe("FILTERING");
  });
});
