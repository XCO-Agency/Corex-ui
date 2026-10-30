import { useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  Icon,
  InlineStack,
  Tabs,
  Text,
} from "@xco-agency/corex-ui";
import type { TabItemType } from "@xco-agency/corex-ui";
import { SearchField } from "@xco-agency/corex-ui";

export function TabsExample() {
  const [selectedId, setSelectedId] = useState("all");
  const [selected, setSelected] = useState(0);
  const [compactTab, setCompactTab] = useState("all");
  const [cardTab, setCardTab] = useState("freeform");

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

  const cardTabs: TabItemType[] = [
    {
      id: "freeform",
      label: "Freeform",
      icon: "chart-vertical",
      badge: 10,
      badgeTone: "success",
    },
    { id: "cohorts", label: "Cohorts", icon: "chart-cohort", badge: 10 },
    { id: "models", label: "Models", icon: "chart-donut", badge: 10 },
  ];

  return (
    <BlockStack gap="large-100">
      <Card padding="none">
        <Tabs variant="card" tabs={cardTabs} value={cardTab} onChange={setCardTab}>
          <Tabs.Content value="freeform">
            <Card>
              <BlockStack gap="small-100">
                <InlineStack justifyContent="space-between" alignItems="center">
                  <Text heading>Metrics</Text>
                  <Icon type="plus" />
                </InlineStack>
                <Text>Online store visitors</Text>
                <InlineStack gap="small-200" alignItems="center">
                  <Icon type="check" />
                  <Text>Sessions</Text>
                </InlineStack>
              </BlockStack>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="cohorts">
            <BlockStack gap="base">
              <Text heading>Cohorts</Text>
              <Text color="subdued">
                Compare groups of customers who share a common characteristic over time.
              </Text>
            </BlockStack>
          </Tabs.Content>
          <Tabs.Content value="models">
            <BlockStack gap="base">
              <Text heading>Models</Text>
              <Text color="subdued">
                Compare models of customers who share a common characteristic over time.
              </Text>
            </BlockStack>
          </Tabs.Content>
        </Tabs>
      </Card>

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
