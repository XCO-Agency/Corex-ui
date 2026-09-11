import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SearchField } from "./SearchField";

describe("SearchField", () => {
  it("renders an s-search-field with default attributes", () => {
    render(<SearchField placeholder="Search items" />);
    const el = document.querySelector("s-search-field");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("placeholder", "Search items");
    expect(el).toHaveAttribute("labelaccessibilityvisibility", "exclusive");
  });

  it("calls onChange when input fires", () => {
    const onChange = vi.fn();
    render(<SearchField onChange={onChange} id="search-1" />);
    const el = document.querySelector("s-search-field")!;

    fireEvent(el, new CustomEvent("input", { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith("", "search-1");
  });

  it("calls onDebouncedChange after debounce delay", () => {
    vi.useFakeTimers();
    const onDebouncedChange = vi.fn();
    render(<SearchField defaultValue="test" onDebouncedChange={onDebouncedChange} debounceDelay={200} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onDebouncedChange).toHaveBeenCalledWith("test");
    vi.useRealTimers();
  });
});
