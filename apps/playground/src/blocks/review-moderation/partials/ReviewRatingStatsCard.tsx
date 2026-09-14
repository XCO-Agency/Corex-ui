import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Box,
  ProgressBar,
  Divider,
} from "@xco-agency/corex-ui";
import type { ReviewRatingStatsType } from "../types";

type ReviewRatingStatsCardPropsType = {
  stats: ReviewRatingStatsType;
};

export function ReviewRatingStatsCard({ stats }: ReviewRatingStatsCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Ratings & Sentiment Overview
            </Text>
            <Text color="subdued" variant="small">
              Aggregate customer satisfaction score across all product catalogs.
            </Text>
          </BlockStack>
          <Badge tone="success">{stats.recommendedPercentage}% Positive Sentiment</Badge>
        </InlineStack>

        <Divider />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px minmax(0, 1fr)",
            gap: "var(--p-space-500, 20px)",
            alignItems: "center",
          }}
        >
          {/* Average Rating Score Box */}
          <Box padding="base" background="subdued" borderRadius="base">
            <BlockStack gap="small-300" alignItems="center">
              <Text as="h1" fontWeight="bold" variant="large">
                {stats.averageRating}
              </Text>
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  color: "#e49e00",
                  fontSize: "1.1rem",
                }}
              >
                {"★".repeat(Math.round(stats.averageRating))}
                {"☆".repeat(5 - Math.round(stats.averageRating))}
              </div>
              <Text color="subdued" variant="small">
                Based on {stats.totalReviews.toLocaleString()} reviews
              </Text>
            </BlockStack>
          </Box>

          {/* Star Distribution Histogram */}
          <BlockStack gap="small-300">
            {stats.starDistribution.map((item) => (
              <div
                key={item.stars}
                style={{
                  display: "grid",
                  gridTemplateColumns: "55px minmax(0, 1fr) 55px",
                  gap: "var(--p-space-300, 12px)",
                  alignItems: "center",
                }}
              >
                <Text variant="small" fontWeight="medium">
                  {item.stars} Stars
                </Text>

                <div style={{ width: "100%" }}>
                  <ProgressBar
                    progress={item.percentage}
                    tone={item.stars >= 4 ? "success" : item.stars === 3 ? "caution" : "critical"}
                    size="sm"
                  />
                </div>

                <div style={{ textAlign: "right" }}>
                  <Text color="subdued" variant="small">
                    {item.count} ({item.percentage}%)
                  </Text>
                </div>
              </div>
            ))}
          </BlockStack>
        </div>
      </BlockStack>
    </Card>
  );
}
