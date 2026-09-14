import * as React from "react";
import { Box, Tabs } from "@xco-agency/corex-ui";
import type { TabItemType } from "@xco-agency/corex-ui";
import type { ResourceTabIdType, ResourceViewTabsPropsType } from "../types";

export function ResourceViewTabs({
  tabs,
  selectedTab,
  onSelectTab,
}: ResourceViewTabsPropsType) {
  const tabItems: TabItemType<ResourceTabIdType>[] = tabs.map((tab) => ({
    id: tab.id,
    label: tab.content,
    badge: tab.count !== undefined ? String(tab.count) : undefined,
  }));

  return (
    <Box paddingInline="base" paddingBlockStart="small-200" paddingBlockEnd="none">
      <Tabs<ResourceTabIdType>
        tabs={tabItems}
        value={selectedTab}
        onChange={(tabId) => onSelectTab(tabId)}
      />
    </Box>
  );
}
