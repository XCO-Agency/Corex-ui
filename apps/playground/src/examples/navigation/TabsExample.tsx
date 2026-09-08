import { useState } from "react";
import { Button, Divider, Icon, Tabs, Text } from "@xco-agency/corex-ui";
import { TabItemType } from "@xco-agency/corex-ui";
import { Card } from "@xco-agency/corex-ui";
import { Box } from "@xco-agency/corex-ui";

export function TabsExample() {
  const [selected, setSelected] = useState(0);
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
      id: "no-icon",
      label: "Disabled Tab",
      disabled: true,
    },
  ];
  return (
    <Box background="base" border="base" borderRadius="large" inlineSize="840px">
      <Box padding="small-200">
        <Tabs
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          rightSide={
            <Button icon="filter">
              <Icon type="search" />
            </Button>
          }
        />
      </Box>
      <Divider />
      <Box padding="small">
        <Text>Panel content for &ldquo;{tabs[selected]!.label}&rdquo;.</Text>
      </Box>
    </Box>
  );
}
