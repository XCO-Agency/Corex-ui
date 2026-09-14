import * as React from "react";
import { Page, Card, BlockStack } from "@xco-agency/corex-ui";
import { ResourceEmptyState } from "../partials/ResourceEmptyState";
import { ResourceViewTabs } from "../partials/ResourceViewTabs";
import { RESOURCE_TABS } from "../constants";
import type { ResourceTabIdType } from "../types";

export function ResourceEmptyExample() {
  const [selectedTab, setSelectedTab] =
    React.useState<ResourceTabIdType>("all");

  const emptyTabs = RESOURCE_TABS.map((tab) => ({
    ...tab,
    count: 0,
  }));

  return (
    <Page
      heading="Products"
      subheading="Manage all catalog items, inventory levels, variants, and statuses."
      inlineSize="large"
      primaryAction={{
        content: "Add product",
        onAction: () => {},
      }}
    >
      <BlockStack gap="base">
        <Card padding="none">
          <ResourceViewTabs
            tabs={emptyTabs}
            selectedTab={selectedTab}
            onSelectTab={setSelectedTab}
          />
          <ResourceEmptyState
            type="zero-records"
            onCreateResource={() => {}}
          />
        </Card>
      </BlockStack>
    </Page>
  );
}
