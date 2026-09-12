import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Navigation, Navigations } from "./index";
import { NavigationItem } from "./NavigationItem";
import { NavigationLabel } from "./NavigationLabel";
import { NavigationFooter } from "./NavigationFooter";

describe("Navigation", () => {
  it("renders sticky footer using Navigation.Footer", () => {
    render(
      <Navigation>
        <Navigation.Item id="home" label="Home" />
        <Navigation.Footer divider>
          <Navigation.Item id="account" label="My Account" icon="person" />
        </Navigation.Footer>
      </Navigation>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("My Account")).toBeInTheDocument();
  });

  it("filters compound items when searching via Navigation.Search", () => {
    render(
      <Navigation>
        <Navigation.Search placeholder="Search navigation..." />
        <Navigation.Label>GENERAL</Navigation.Label>
        <Navigation.Item id="analytics" label="Analytics" />
        <Navigation.Item id="discounts" label="Discounts" />
      </Navigation>,
    );

    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Discounts")).toBeInTheDocument();

    const searchField = document.querySelector("s-search-field");
    expect(searchField).toBeInTheDocument();
  });

  it("supports debounced search and input events on Navigation.Search", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const onDebouncedChange = vi.fn();

    render(
      <Navigation>
        <Navigation.Search
          placeholder="Search navigation..."
          onChange={onChange}
          onDebouncedChange={onDebouncedChange}
          debounceDelay={200}
        />
        <Navigation.Item id="analytics" label="Analytics" />
      </Navigation>,
    );

    const searchField = document.querySelector("s-search-field")!;
    (searchField as any).value = "orders";
    fireEvent(searchField, new CustomEvent("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("orders", undefined);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onDebouncedChange).toHaveBeenCalledWith("orders");
    vi.useRealTimers();
  });

  it("renders link url on Clickable when url prop is passed to item", () => {
    const { container } = render(
      <Navigation>
        <Navigation.Item id="docs" label="Documentation" url="https://example.com" />
      </Navigation>,
    );

    expect(screen.getByText("Documentation")).toBeInTheDocument();
    const clickable = container.querySelector("s-clickable");
    expect(clickable).toBeInTheDocument();
    expect(clickable).toHaveAttribute("href", "https://example.com");
  });

  it("renders standalone NavigationItem, NavigationLabel and NavigationFooter", () => {
    render(
      <div>
        <NavigationLabel>Standalone Label</NavigationLabel>
        <NavigationItem id="standalone" label="Standalone Item" />
        <NavigationFooter>
          <span>Footer Content</span>
        </NavigationFooter>
      </div>,
    );
    expect(screen.getByText("Standalone Label")).toBeInTheDocument();
    expect(screen.getByText("Standalone Item")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("exports Navigations as alias", () => {
    expect(Navigations).toBe(Navigation);
  });
});
