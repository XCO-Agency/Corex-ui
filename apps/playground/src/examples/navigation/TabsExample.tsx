import { useState } from "react";
import { BlockStack, Box, Button, Divider, Icon, Tabs, Text } from "@xco-agency/corex-ui";
import type { TabItemType } from "@xco-agency/corex-ui";
import { SearchField } from "@xco-agency/corex-ui";

export function TabsExample() {
  const [selectedId, setSelectedId] = useState("all");
  const [selected, setSelected] = useState(0);
  const [compactTab, setCompactTab] = useState("all");

  const compactTabs: TabItemType[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "draft", label: "Draft" },
    { id: "archived", label: "Archived" },
  ];

  const tabs: TabItemType[] = [
    {
      id: "all",
      label: "With tooltip",
      icon: "layout-popup",
      tooltip: "Tooltip example",
    },
    {
      id: "drafts",
      label: "Badge caution",
      icon: "toggle-off",
      badge: 10,
      badgeTone: "caution",
    },
    {
      id: "archived",
      label: "Badge Information",
      icon: "settings",
      badge: "info",
      badgeTone: "info",
    },
    {
      id: "no-icon",
      label: "No Icon",
      badge: 2,
    },
    {
      id: "disabled",
      label: "Disabled Tab",
      disabled: true,
    },
  ];

  return (
    <BlockStack gap="large-100">
      {/* Compact Dropdown Mode (Polaris IndexFilters style) */}
      <Box background="base" border="base" borderRadius="large" inlineSize="840px">
        <Box padding="small-200">
          <Tabs
            tabs={compactTabs}
            value={compactTab}
            onChange={setCompactTab}
            compact
            rightSide={
              <Button icon="search" variant="tertiary">
                Search and filter
              </Button>
            }
          >
            <SearchField />
          </Tabs>
        </Box>
        <Divider />
        <Box padding="base">
          <Text>
            Compact dropdown active view: &ldquo;{compactTab}&rdquo; (
            {compactTabs.find((t) => t.id === compactTab)?.label}).
          </Text>
        </Box>
      </Box>

      {/* Standard ID-based Tabs */}
      <Box background="base" border="base" borderRadius="large" inlineSize="840px">
        <Box padding="small-200">
          <Tabs
            tabs={tabs}
            value={selectedId}
            onChange={setSelectedId}
            rightSide={
              <Button icon="filter">
                <Icon type="search" />
              </Button>
            }
          />
        </Box>
        <Divider />
        <Box padding="base">
          <Text>
            ID-based panel content for tab id &ldquo;{selectedId}&rdquo; (
            {tabs.find((t) => t.id === selectedId)?.label}).
          </Text>
        </Box>
      </Box>

      {/* Standard Index-based Tabs */}
      <Box background="base" border="base" borderRadius="large" inlineSize="840px">
        <Box padding="small-200">
          <Tabs tabs={tabs} selected={selected} onSelect={setSelected} />
        </Box>
        <Divider />
        <Box padding="base">
          <Text>
            Index-based panel content for index {selected} (&ldquo;
            {tabs[selected]?.label}&rdquo;).
          </Text>
        </Box>
      </Box>
    </BlockStack>
  );
}
