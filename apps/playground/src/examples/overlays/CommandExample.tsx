import { useEffect, useState } from "react";
import {
  BlockStack,
  Button,
  Command,
  Icon,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";

export function CommandExample() {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const select = (value: string) => {
    setLast(value);
    setOpen(false);
    setSidebarOpen(false);
  };

  return (
    <BlockStack gap="large-200">
      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Inline command menu
        </Text>
        <Text as="p" variant="small" color="subdued">
          Filterable list with groups, shortcuts, and empty state — built on cmdk like shadcn.
        </Text>
        <Command label="Command menu">
          <Command.Input placeholder="Type a command or search..." />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Suggestions">
              <Command.Item value="calendar" onSelect={select}>
                <Icon source="calendar" size="small" />
                Calendar
              </Command.Item>
              <Command.Item value="emoji" onSelect={select}>
                <Icon source="search" size="small" />
                Search Emoji
              </Command.Item>
              <Command.Item value="calculator" onSelect={select}>
                <Icon source="order" size="small" />
                Calculator
              </Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Settings">
              <Command.Item value="profile" onSelect={select}>
                <Icon source="person" size="small" />
                Profile
                <Command.Shortcut>⌘P</Command.Shortcut>
              </Command.Item>
              <Command.Item value="billing" onSelect={select}>
                <Icon source="receipt" size="small" />
                Billing
                <Command.Shortcut>⌘B</Command.Shortcut>
              </Command.Item>
              <Command.Item value="settings" onSelect={select}>
                <Icon source="settings" size="small" />
                Settings
                <Command.Shortcut>⌘S</Command.Shortcut>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
        {last ? (
          <Text as="p" variant="small" color="subdued">
            Last selected: {last}
          </Text>
        ) : null}
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Sidebar groups
        </Text>
        <Text as="p" variant="small" color="subdued">
          Enable with `sidebar`. Groups appear as a left nav; hover or click a group to show its
          items on the right. Typing in search shows matches across all groups.
        </Text>
        <Command
          label="Sidebar command menu"
          sidebar
          defaultSidebarGroup="suggestions"
          sidebarWidth="11rem"
        >
          <Command.Input placeholder="Filter commands..." />
          <Command.List maxHeight="16rem">
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group
              heading="Suggestions"
              value="suggestions"
              icon={<Icon source="search" size="small" />}
            >
              <Command.Item value="calendar" onSelect={select}>
                <Icon source="calendar" size="small" />
                Calendar
              </Command.Item>
              <Command.Item value="emoji" onSelect={select}>
                <Icon source="search" size="small" />
                Search Emoji
              </Command.Item>
              <Command.Item value="calculator" onSelect={select}>
                <Icon source="order" size="small" />
                Calculator
              </Command.Item>
            </Command.Group>
            <Command.Group
              heading="Settings"
              value="settings"
              icon={<Icon source="settings" size="small" />}
            >
              <Command.Item value="profile" onSelect={select}>
                <Icon source="person" size="small" />
                Profile
                <Command.Shortcut>⌘P</Command.Shortcut>
              </Command.Item>
              <Command.Item value="billing" onSelect={select}>
                <Icon source="receipt" size="small" />
                Billing
                <Command.Shortcut>⌘B</Command.Shortcut>
              </Command.Item>
              <Command.Item value="settings" onSelect={select}>
                <Icon source="settings" size="small" />
                Settings
                <Command.Shortcut>⌘S</Command.Shortcut>
              </Command.Item>
            </Command.Group>
            <Command.Group
              heading="Help"
              value="help"
              icon={<Icon source="info" size="small" />}
            >
              <Command.Item value="docs" onSelect={select}>
                Documentation
              </Command.Item>
              <Command.Item value="support" onSelect={select}>
                Contact support
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Command palette dialog
        </Text>
        <Text as="p" variant="small" color="subdued">
          Open with the button or ⌘K / Ctrl+K. Uses Base UI Dialog for the overlay.
        </Text>
        <InlineStack gap="small-200">
          <Button variant="primary" onClick={() => setOpen(true)}>
            Open palette
          </Button>
          <Button onClick={() => setSidebarOpen(true)}>Open sidebar palette</Button>
        </InlineStack>

        <Command.Dialog open={open} onOpenChange={setOpen}>
          <Command label="Command palette">
            <Command.Input placeholder="Search for a command to run..." />
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Group heading="Actions">
                <Command.Item value="new-file" onSelect={select}>
                  New File
                </Command.Item>
                <Command.Item value="new-folder" onSelect={select}>
                  New Folder
                </Command.Item>
                <Command.Item value="search" onSelect={select}>
                  Search Everywhere
                </Command.Item>
              </Command.Group>
              <Command.Separator />
              <Command.Group heading="Navigation">
                <Command.Item value="home" onSelect={select}>
                  Go to Home
                </Command.Item>
                <Command.Item value="settings-nav" onSelect={select}>
                  Go to Settings
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </Command.Dialog>

        <Command.Dialog
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          title="Browse commands"
        >
          <Command sidebar defaultSidebarGroup="actions" label="Sidebar palette">
            <Command.Input placeholder="Search commands..." />
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Group heading="Actions" value="actions">
                <Command.Item value="new-file-sb" onSelect={select}>
                  New File
                </Command.Item>
                <Command.Item value="new-folder-sb" onSelect={select}>
                  New Folder
                </Command.Item>
              </Command.Group>
              <Command.Group heading="Navigation" value="navigation">
                <Command.Item value="home-sb" onSelect={select}>
                  Go to Home
                </Command.Item>
                <Command.Item value="settings-sb" onSelect={select}>
                  Go to Settings
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </Command.Dialog>
      </BlockStack>
    </BlockStack>
  );
}
