import * as React from "react";
import { MetricItemType } from "./MetricsDashboardExample";
import {
  MetricCard,
  DatePicker,
  BlockStack,
  Collapsible,
  Grid,
  Page,
  Modal,
  Text,
  Card,
  Badge,
  InlineStack,
  Box,
  Icon,
  Divider,
} from "@xco-agency/corex-ui";
import type { DateRangeType } from "@xco-agency/corex-ui";

const METRICS: MetricItemType[] = [
  {
    id: "sales",
    title: "Total Sales",
    value: "$14,820.00",
    change: "12.5%",
    changeTone: "success",
    changeDir: "up",
    tooltip: "Gross sales minus discounts and returns",
    icon: "order",
    sparklineData: [12, 18, 14, 26, 32, 28, 42, 38, 55, 62, 58, 70],
    sparklineColor: "success",
    previousValue: "$13,200.00",
  },
  {
    id: "sessions",
    title: "Online Store Sessions",
    value: "8,450",
    change: "8.2%",
    changeTone: "success",
    changeDir: "up",
    tooltip: "Visitors count across desktop and mobile channels",
    icon: "view",
    sparklineData: [20, 24, 22, 35, 30, 48, 44, 52, 60, 58, 65, 80],
    sparklineColor: "success",
    previousValue: "7,810",
  },
  {
    id: "orders",
    title: "Total Orders",
    value: "582",
    change: "3.4%",
    changeTone: "critical",
    changeDir: "down",
    tooltip: "Completed customer checkouts within the period",
    icon: "order",
    sparklineData: [5, 8, 12, 10, 15, 18, 14, 22, 25, 20, 28, 32],
    sparklineColor: "critical",
    previousValue: "602",
  },
  {
    id: "conversion",
    title: "Conversion Rate",
    value: "3.45%",
    change: "0.8%",
    changeTone: "success",
    changeDir: "up",
    tooltip: "Percentage of sessions that converted into orders",
    icon: "chart-line",
    sparklineData: [2.2, 2.5, 2.1, 3.0, 2.8, 3.2, 3.0, 3.5, 3.2, 3.4, 3.1, 3.6],
    sparklineColor: "success",
    previousValue: "2.65%",
  },
];

export function MetricsDashboardAdvancedExample() {
  const [selectedDate, setSelectedDate] = React.useState<DateRangeType>({
    start: "",
    end: "",
  });

  // Tab-like: only one "expand" card's panel is shown at a time. Selecting
  // another one swaps the panel instead of stacking it, independent of the
  // cards wired to an external action.
  const [expandedId, setExpandedId] = React.useState<MetricItemType["id"] | null>(
    "sales",
  );
  const [drilldownMetric, setDrilldownMetric] = React.useState<MetricItemType | null>(
    null,
  );

  function handleCardClick(item: MetricItemType) {
    if (item.id === "orders") {
      setDrilldownMetric(item);
      return;
    }

    setExpandedId((prev) => (prev === item.id ? null : item.id));
  }

  return (
    <Page heading="Metrics dashboard (independent card interactions)">
      <BlockStack gap="400">
        <DatePicker selected={selectedDate} presets onApply={setSelectedDate} />

        {/* Each card owns its own click behavior: expand inline vs. an external action.
            Collapsible frames the grid + panel together and animates the panel in/out. */}
        <Collapsible
          expanded={!!expandedId}
          separator
          content={<ActiveTabContent expandedId={expandedId} selectedDate={selectedDate} />}
        >
          <Grid columns={{ xs: 1, sm: 2, md: 4 }} gap="base">
            {METRICS.map((item) => (
              <MetricCard
                key={item.id}
                id={`metric-${item.id}`}
                title={item.title}
                value={item.value}
                icon={item.icon}
                tooltip={item.tooltip}
                badge={
                  item.change
                    ? {
                        value: item.change,
                        dir: item.changeDir,
                        tone: item.changeTone,
                      }
                    : undefined
                }
                pressed={expandedId === item.id}
                expanded={!!expandedId}
                onClick={() => handleCardClick(item)}
                sparklineData={item.sparklineData}
                sparklineColor={item.sparklineColor}
              />
            ))}
          </Grid>
        </Collapsible>
      </BlockStack>

      {/* The "external" card never touches expand state — it can open a modal,
          navigate, call an API, or anything else the consumer wires up. */}
      <Modal
        open={!!drilldownMetric}
        onClose={() => setDrilldownMetric(null)}
        title={drilldownMetric?.title}
        primaryAction={{
          content: "View all orders",
          onAction: () => setDrilldownMetric(null),
        }}
        secondaryActions={[
          { content: "Close", onAction: () => setDrilldownMetric(null) },
        ]}
      >
        <BlockStack gap="200">
          <Text as="span">
            {drilldownMetric?.value} total, {drilldownMetric?.change}{" "}
            {drilldownMetric?.changeDir === "up" ? "increase" : "decrease"} vs previous
            period ({drilldownMetric?.previousValue}).
          </Text>
          <Text as="span" color="subdued">
            This card is wired to an external action instead of the inline expand panel —
            hook it up to a route, drawer, or report of your choosing.
          </Text>
        </BlockStack>
      </Modal>
    </Page>
  );
}

// Picks which tab's static preview content to render for the active card.
// Each tab is deliberately minimal and self-contained — plain hardcoded
// data, no metrics wiring — just enough to show distinct content per card.
function ActiveTabContent({
  expandedId,
  selectedDate,
}: {
  expandedId: MetricItemType["id"] | null;
  selectedDate: DateRangeType;
}) {
  const dateLabel = selectedDate.start || "Selected Period";

  if (expandedId === "sessions") return <TabContent2 selectedDate={dateLabel} />;
  if (expandedId === "conversion") return <TabContent3 selectedDate={dateLabel} />;
  return <TabContent1 selectedDate={dateLabel} />;
}

function TabContent1({ selectedDate }: { selectedDate: string }) {
  return (
    <Box padding="base">
      <BlockStack gap="300">
        <InlineStack justifyContent="space-between" alignItems="center">
          <InlineStack gap="200" alignItems="center">
            <Icon type="chart-line" tone="success" />
            <Text as="span">Sales trend for {selectedDate}</Text>
          </InlineStack>
          <Badge tone="success">+12.5% vs previous period</Badge>
        </InlineStack>
        <Divider />
        <Text as="span" color="subdued">
          $14,820.00 total, up from $13,200.00 last period.
        </Text>
      </BlockStack>
    </Box>
  );
}

function TabContent2({ selectedDate }: { selectedDate: string }) {
  return (
    <Box padding="base">
      <BlockStack gap="300">
        <InlineStack justifyContent="space-between" alignItems="center">
          <InlineStack gap="200" alignItems="center">
            <Icon type="view" tone="info" />
            <Text as="span">Session traffic for {selectedDate}</Text>
          </InlineStack>
          <Badge tone="info">+8.2% vs previous period</Badge>
        </InlineStack>
        <Divider />
        <Text as="span" color="subdued">
          8,450 sessions, mostly from mobile and organic search.
        </Text>
      </BlockStack>
    </Box>
  );
}

function TabContent3({ selectedDate }: { selectedDate: string }) {
  return (
    <Box padding="base">
      <BlockStack gap="300">
        <InlineStack justifyContent="space-between" alignItems="center">
          <InlineStack gap="200" alignItems="center">
            <Icon type="chart-line" tone="success" />
            <Text as="span">Conversion funnel for {selectedDate}</Text>
          </InlineStack>
          <Badge tone="success">+0.8% vs previous period</Badge>
        </InlineStack>
        <Divider />
        <Text as="span" color="subdued">
          3.45% of sessions converted, up from 2.65% last period.
        </Text>
      </BlockStack>
    </Box>
  );
}
