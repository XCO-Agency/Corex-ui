import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Command } from "./Command";

beforeAll(() => {
  // Keyboard selection scrolls the highlighted item into view; jsdom lacks these APIs.
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  Element.prototype.scrollIntoView = vi.fn();
});

describe("Command", () => {
  it("exposes compound parts on Command", () => {
    expect(Command.Input).toBeTruthy();
    expect(Command.List).toBeTruthy();
    expect(Command.Empty).toBeTruthy();
    expect(Command.Group).toBeTruthy();
    expect(Command.Item).toBeTruthy();
    expect(Command.Separator).toBeTruthy();
    expect(Command.Shortcut).toBeTruthy();
    expect(Command.Dialog).toBeTruthy();
  });

  it("renders input, groups, items and injects styles", () => {
    render(
      <Command>
        <Command.Input placeholder="Search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions">
            <Command.Item value="calendar">Calendar</Command.Item>
            <Command.Item value="emoji">Search Emoji</Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Settings">
            <Command.Item value="profile">
              Profile
              <Command.Shortcut>⌘P</Command.Shortcut>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>,
    );

    expect(document.getElementById("cx-command-styles")).toBeTruthy();
    expect(document.querySelector('[data-slot="command"]')).toBeTruthy();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("⌘P")).toBeInTheDocument();
  });

  it("filters items as the user types", () => {
    render(
      <Command>
        <Command.Input placeholder="Filter" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Item value="calendar">Calendar</Command.Item>
          <Command.Item value="calculator">Calculator</Command.Item>
        </Command.List>
      </Command>,
    );

    fireEvent.change(screen.getByPlaceholderText("Filter"), {
      target: { value: "calc" },
    });

    expect(screen.queryByText("Calendar")).not.toBeInTheDocument();
    expect(screen.getByText("Calculator")).toBeInTheDocument();
  });

  it("calls onSelect when an item is chosen", () => {
    const onSelect = vi.fn();
    render(
      <Command>
        <Command.Input placeholder="Search" />
        <Command.List>
          <Command.Item value="calendar" onSelect={onSelect}>
            Calendar
          </Command.Item>
        </Command.List>
      </Command>,
    );

    fireEvent.click(screen.getByText("Calendar"));
    expect(onSelect).toHaveBeenCalledWith("calendar");
  });

  it("renders Command.Dialog when open", () => {
    render(
      <Command.Dialog open>
        <Command>
          <Command.Input placeholder="Palette search" />
          <Command.List>
            <Command.Item value="one">One</Command.Item>
          </Command.List>
        </Command>
      </Command.Dialog>,
    );

    expect(document.querySelector('[data-slot="command-dialog-popup"]')).toBeTruthy();
    expect(screen.getByPlaceholderText("Palette search")).toBeInTheDocument();
    expect(screen.getByText("Command Palette")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Command Palette" })).toHaveAttribute("aria-modal", "true");
    expect(document.activeElement).toBe(screen.getByPlaceholderText("Palette search"));
  });

  it("closes Command.Dialog on Escape", () => {
    const onOpenChange = vi.fn();
    render(
      <Command.Dialog open onOpenChange={onOpenChange}>
        <Command>
          <Command.Input placeholder="Palette search" />
        </Command>
      </Command.Dialog>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false, { reason: "escape-key" });
  });

  it("shows a sidebar of groups and swaps the right panel on select/hover", () => {
    render(
      <Command sidebar defaultSidebarGroup="suggestions">
        <Command.Input placeholder="Sidebar search" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions" value="suggestions">
            <Command.Item value="calendar">Calendar</Command.Item>
          </Command.Group>
          <Command.Group heading="Settings" value="settings">
            <Command.Item value="profile">Profile</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>,
    );

    expect(document.querySelector('[data-slot="command"]')).toHaveAttribute("data-sidebar");
    expect(document.querySelector('[data-slot="command-sidebar"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "Suggestions" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    expect(screen.queryByText("No results found.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByText("Profile")).toBeVisible();
    expect(screen.queryByText("Calendar")).not.toBeInTheDocument();
    expect(screen.queryByText("No results found.")).not.toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Suggestions" }));
    expect(screen.getByText("Calendar")).toBeVisible();
  });

  it("hides Empty while results exist and shows it when search matches nothing", () => {
    render(
      <Command sidebar defaultSidebarGroup="suggestions">
        <Command.Input placeholder="Sidebar search" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions" value="suggestions">
            <Command.Item value="calendar">Calendar</Command.Item>
          </Command.Group>
          <Command.Group heading="Settings" value="settings">
            <Command.Item value="profile">Profile</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>,
    );

    expect(screen.queryByText("No results found.")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Sidebar search"), {
      target: { value: "zzzz-no-match" },
    });

    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.queryByText("Calendar")).not.toBeInTheDocument();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("moves the highlight with the keyboard, skips disabled items and selects with Enter", () => {
    const onSelect = vi.fn();
    render(
      <Command>
        <Command.Input placeholder="Keys" />
        <Command.List>
          <Command.Item value="one" onSelect={onSelect}>One</Command.Item>
          <Command.Item value="two" disabled onSelect={onSelect}>Two</Command.Item>
          <Command.Item value="three" onSelect={onSelect}>Three</Command.Item>
        </Command.List>
      </Command>,
    );
    const input = screen.getByPlaceholderText("Keys");
    const option = (name: string) => screen.getByRole("option", { name });
    expect(option("One")).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(option("Three")).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", option("Three").id);

    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("three");
    expect(onSelect).not.toHaveBeenCalledWith("two");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(option("Three")).toHaveAttribute("aria-selected", "true");
  });

  it("matches keywords and in-order letters, hiding empty groups and separators while searching", () => {
    render(
      <Command>
        <Command.Input placeholder="Find" />
        <Command.List>
          <Command.Group heading="Apps">
            <Command.Item value="settings">Settings</Command.Item>
          </Command.Group>
          <Command.Separator data-testid="separator" />
          <Command.Group heading="Other">
            <Command.Item value="billing" keywords={["invoice"]}>Billing</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>,
    );
    expect(screen.getByTestId("separator")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Find"), { target: { value: "invoice" } });
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    expect(screen.getByText("Apps").closest('[data-slot="command-group"]')).not.toBeVisible();
    expect(screen.queryByTestId("separator")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Find"), { target: { value: "stg" } });
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.queryByText("Billing")).not.toBeInTheDocument();
  });
});

