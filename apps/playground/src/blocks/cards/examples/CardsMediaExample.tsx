import * as React from "react";
import {
  Box,
  BlockStack,
  Grid,
  Text,
  Banner,
} from "@xco-agency/corex-ui";
import { MediaCard } from "../partials/MediaCard";
import type { CardBadgeType } from "../partials/MinimalistCard";

export type MediaCardItemType = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  badge?: CardBadgeType;
  metaText?: string;
};

export const MEDIA_CARD_ITEMS: MediaCardItemType[] = [
  {
    id: "media-1",
    title: "Omnichannel Retargeting Campaign",
    description:
      "Synchronize your customer segments across Meta, Google, and TikTok to deliver personalized dynamic product remarketing ads.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Marketing data analytics and campaign metrics dashboard",
    badge: {
      text: "Marketing",
      tone: "info",
    },
    metaText: "Updated 2 hours ago",
  },
  {
    id: "media-2",
    title: "Live Social Proof Feeds",
    description:
      "Stream genuine customer UGC and verified review badges directly on your high-traffic product detail and collection pages.",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Retail customer shopping in a modern storefront",
    badge: {
      text: "Social Proof",
      tone: "success",
    },
    metaText: "4,200+ impressions today",
  },
  {
    id: "media-3",
    title: "AI-Powered Customer Reviews",
    description:
      "Summarize sentiment from verified buyer reviews and highlight top product attributes directly in the storefront search bar.",
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Digital customer support and AI chat interaction",
    badge: {
      text: "AI Feature",
      tone: "neutral",
    },
    metaText: "98% accuracy score",
  },
];

export function CardsMediaExample() {
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);

  return (
    <BlockStack gap="base">
      {selectedTopic && (
        <Banner tone="info" onDismiss={() => setSelectedTopic(null)}>
          <Text variant="bodyMd">{selectedTopic}</Text>
        </Banner>
      )}

      <Box>
        <Text variant="bodyMd" color="subdued">
          Media cards showcase rich imagery with 16:9 aspect ratios and rounded corners, paired with headings and descriptive copy. Ideal for tutorials, case studies, and feature highlights.
        </Text>
      </Box>

      <Grid columns={{ sm: 1, md: 3 }} gap="base">
        {MEDIA_CARD_ITEMS.map((item) => (
          <MediaCard
            key={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl!}
            imageAlt={item.imageAlt}
            badge={item.badge}
            metaText={item.metaText}
            onOptionsClick={() => setSelectedTopic(`Options for: ${item.title}`)}
          />
        ))}
      </Grid>
    </BlockStack>
  );
}
