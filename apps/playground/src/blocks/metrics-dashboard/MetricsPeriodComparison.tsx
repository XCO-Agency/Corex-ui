import * as React from "react";
import {
  Card,
  Text,
  Badge,
  InlineStack,
  BlockStack,
  Box,
  Icon,
  Divider,
} from "@xco-agency/corex-ui";
import { MetricItemType } from "./MetricsDashboardExample";

type MetricsPeriodComparisonPropsType = {
  selectedDate: string;
  metrics: MetricItemType[];
};

export function MetricsPeriodComparison({
  selectedDate,
  metrics,
}: MetricsPeriodComparisonPropsType) {
  return (
    <Card heading="Period-over-Period Performance">
      <BlockStack gap="300">
        <Box background="subdued" padding="300" borderRadius="base">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <Icon type="chart-line" />
              <Text as="span" variant="bodySm" fontWeight="medium">
                Comparative Analysis for {selectedDate}
              </Text>
            </InlineStack>
            <Badge tone="success">Calculated vs Previous Period</Badge>
          </InlineStack>
        </Box>

        <InlineStack gap="300" wrap>
          {metrics.map((m) => {
            const isUp = m.changeDir === "up";
            const tone = isUp ? "success" : "critical";
            const iconType = isUp ? "arrow-up" : "arrow-down";

            return (
              <Box
                key={m.id}
                background="surface"
                padding="300"
                borderRadius="base"
                borderWidth="050"
                borderColor="subdued"
                minInlineSize="200px"
              >
                <BlockStack gap="150">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="span" variant="bodySm" color="subdued">
                      {m.title}
                    </Text>
                    <Icon type={iconType} tone={tone} />
                  </InlineStack>

                  <InlineStack align="space-between" blockAlign="baseline">
                    <Text as="span" variant="headingMd">
                      {m.value}
                    </Text>
                    {m.previousValue && (
                      <Text as="span" variant="bodySm" color="subdued">
                        prev {m.previousValue}
                      </Text>
                    )}
                  </InlineStack>

                  <Divider />

                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="span" variant="bodySm" color="subdued">
                      Period Delta
                    </Text>
                    <Badge tone={tone}>
                      {isUp ? "+" : ""}
                      {m.change}
                    </Badge>
                  </InlineStack>
                </BlockStack>
              </Box>
            );
          })}
        </InlineStack>

        <Divider />

        <InlineStack align="space-between" blockAlign="center">
          <Text as="span" variant="bodySm" color="subdued">
            All timezones calculated in Store Local Time (UTC-04:00)
          </Text>
          <Text as="span" variant="bodySm" color="subdued">
            Real-time telemetry enabled
          </Text>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
