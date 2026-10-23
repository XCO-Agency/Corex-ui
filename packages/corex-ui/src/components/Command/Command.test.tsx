import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Command } from "./Command";

beforeAll(() => {
  // cmdk measures / scrolls the list; jsdom does not provide these APIs.
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
});
