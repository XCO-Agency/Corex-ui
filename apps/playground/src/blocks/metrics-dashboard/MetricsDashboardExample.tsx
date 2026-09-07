import * as React from "react";
import { MetricCard, DatePicker, BlockStack, Grid, Page } from "@xco-agency/corex-ui";
import type { MetricCardPropsType, DateRangeType, ToneType } from "@xco-agency/corex-ui";

export type MetricItemType = Omit<MetricCardPropsType, "onClick"> & {
  id: "sales" | "sessions" | "orders" | "conversion";
  change?: string;
  changeTone?: ToneType;
  changeDir?: "up" | "down";
  comparisonLabel?: string;
  previousValue?: string;
};

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

export function MetricsDashboardExample() {
  const [selectedDate, setSelectedDate] = React.useState<DateRangeType>({
    start: "",
    end: "",
  });

  return (
    <Page heading="Metrics dashboard">
      <BlockStack gap="400">
        <DatePicker selected={selectedDate} presets onApply={setSelectedDate} />

        {/* 4-card MetricCard Grid */}
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
              onClick={() => alert("Clicked on " + item.title)}
              sparklineData={item.sparklineData}
              sparklineColor={item.sparklineColor}
            />
          ))}
        </Grid>
      </BlockStack>
    </Page>
  );
}
