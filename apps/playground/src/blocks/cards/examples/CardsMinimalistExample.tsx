import * as React from "react";
import {
  Box,
  BlockStack,
  Grid,
  Text,
  Banner,
} from "@xco-agency/corex-ui";
import { MinimalistCard, type CardBadgeType } from "../partials/MinimalistCard";
export type MinimalistCardItemType = {
  id: string;
  title: string;
  description: string;
  badge?: CardBadgeType;
  metaText?: string;
};

export const MINIMALIST_CARD_ITEMS: MinimalistCardItemType[] = [
  {
    id: "mini-1",
    title: "Store Speed Optimization",
    description:
      "Compress storefront assets and defer third-party scripts to achieve a sub-second Time to Interactive across all mobile devices.",
    badge: {
      text: "Recommended",
      tone: "success",
    },
    metaText: "Est. +14% mobile conversion",
  },
  {
    id: "mini-2",
    title: "Automated Checkout Upsell",
    description:
      "Recommend complementary high-margin accessories directly inside the Shopify checkout drawer based on customer cart contents.",
    badge: {
      text: "High Impact",
      tone: "info",
    },
    metaText: "Est. +$8.40 Average Order Value",
  },
  {
    id: "mini-3",
    title: "Dynamic Free Shipping Bar",
    description:
      "Display real-time tier thresholds to incentivize customers to add more items to their cart before proceeding to final payment.",
    badge: {
      text: "Quick Setup",
      tone: "neutral",
    },
    metaText: "2 min configuration",
  },
];

export function CardsMinimalistExample() {
  const [selectedTip, setSelectedTip] = React.useState<string | null>(null);

  return (
    <BlockStack gap="base">
      {selectedTip && (
        <Banner tone="info" onDismiss={() => setSelectedTip(null)}>
          <Text variant="bodyMd">{selectedTip}</Text>
        </Banner>
      )}

      <Box>
        <Text variant="bodyMd" color="subdued">
          Minimalist cards prioritize typography, scannability, and subtle indicators. Ideal for store recommendations, system health tips, and concise setup summaries.
        </Text>
      </Box>

      <Grid columns={{ sm: 1, md: 3 }} gap="base">
        {MINIMALIST_CARD_ITEMS.map((item) => (
          <MinimalistCard
            key={item.id}
            title={item.title}
            description={item.description}
            badge={item.badge}
            metaText={item.metaText}
            onOptionsClick={() => setSelectedTip(`Options for: ${item.title}`)}
          />
        ))}
      </Grid>
    </BlockStack>
  );
}
