import * as React from "react";
import { Box, Tabs } from "@xco-agency/corex-ui";
import type { TabItemType } from "@xco-agency/corex-ui";
import type {
  IntegrationCategoryTabsPropsType,
  IntegrationCategoryType,
} from "../types";

export function IntegrationCategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: IntegrationCategoryTabsPropsType) {
  const tabs: TabItemType<IntegrationCategoryType>[] = categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    badge: String(cat.count),
  }));

  return (
    <Box paddingInline="base" paddingBlockStart="small-200">
      <Tabs<IntegrationCategoryType>
        tabs={tabs}
        value={selectedCategory}
        onChange={(id) => onSelectCategory(id)}
      />
    </Box>
  );
}
