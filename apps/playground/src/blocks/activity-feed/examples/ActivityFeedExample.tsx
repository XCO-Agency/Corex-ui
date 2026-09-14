import * as React from "react";
import { Page, Card, BlockStack, Text } from "@xco-agency/corex-ui";
import { MOCK_ACTIVITIES } from "../constants";
import { ActivityFilters } from "../partials/ActivityFilters";
import { ActivityTimelineItem } from "../partials/ActivityTimelineItem";
import { ActivityEmptyState } from "../partials/ActivityEmptyState";
import { ActivityPayloadModal } from "../partials/ActivityPayloadModal";
import type { ActivityEventType, ActivityItemType } from "../types";
import { Banner } from "@xco-agency/corex-ui";
import { InlineStack } from "@xco-agency/corex-ui";

export function ActivityFeedExample() {
  const [activities, setActivities] = React.useState<ActivityItemType[]>(MOCK_ACTIVITIES);
  const [activeFilter, setActiveFilter] = React.useState<ActivityEventType>("all");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [inspectedItem, setInspectedItem] = React.useState<ActivityItemType | null>(null);
  const [feedbackNotice, setFeedbackNotice] = React.useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setFeedbackNotice("Activity feed refreshed with latest events.");
      setTimeout(() => setFeedbackNotice(null), 3500);
    }, 500);
  };

  const handleActionClick = (actionLabel: string, item: ActivityItemType) => {
    setFeedbackNotice(`Clicked "${actionLabel}" for ${item.title}`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const filteredActivities = React.useMemo(() => {
    if (activeFilter === "all") return activities;
    return activities.filter((act) => act.eventType === activeFilter);
  }, [activities, activeFilter]);

  const groupedActivities = React.useMemo(() => {
    const groups: Record<string, ActivityItemType[]> = {};
    for (const act of filteredActivities) {
      if (!groups[act.dateGroup]) {
        groups[act.dateGroup] = [];
      }
      groups[act.dateGroup]!.push(act);
    }
    return groups;
  }, [filteredActivities]);

  const dateGroups = Object.keys(groupedActivities);

  return (
    <Page inlineSize="small">
      {/* Floating / Inline Action Notification Feedback */}
      {feedbackNotice && (
        <Banner dismissible onDismiss={() => setFeedbackNotice(null)} tone="info">
          {feedbackNotice}
        </Banner>
      )}

      {/* Main Card Surface */}
      <Card>
        <BlockStack gap="base">
          {/* Top Bar: Recent Activity Header + Filter & Refresh Buttons */}
          <ActivityFilters
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {filteredActivities.length === 0 ? (
            <ActivityEmptyState onReset={() => setActiveFilter("all")} />
          ) : (
            <BlockStack gap="large-100">
              {dateGroups.map((dateGroup) => {
                const items = groupedActivities[dateGroup] ?? [];
                return (
                  <div key={dateGroup}>
                    {/* Date Section Heading */}
                    <InlineStack paddingBlockEnd="small">
                      <Text variant="base" heading>
                        {dateGroup}
                      </Text>
                    </InlineStack>

                    {/* Connected Timeline Flow */}
                    {items.map((item, index) => {
                      const isLastItem = index === items.length - 1;
                      return (
                        <ActivityTimelineItem
                          key={item.id}
                          item={item}
                          isLast={isLastItem}
                          onActionClick={handleActionClick}
                          onViewPayload={setInspectedItem}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </BlockStack>
          )}
        </BlockStack>
      </Card>

      {/* JSON Payload Inspector Modal */}
      <ActivityPayloadModal
        open={inspectedItem !== null}
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
      />
    </Page>
  );
}
