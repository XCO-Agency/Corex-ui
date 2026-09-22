import * as React from "react";
import {
  Box,
  BlockStack,
  Grid,
  Text,
  Banner,
} from "@xco-agency/corex-ui";
import { MediaActionCard, type CardActionType } from "../partials/MediaActionCard";
import type { CardBadgeType } from "../partials/MinimalistCard";

export type MediaActionCardItemType = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  badge?: CardBadgeType;
  metaText?: string;
  primaryAction?: CardActionType;
  secondaryAction?: CardActionType;
};

export const MEDIA_ACTION_CARD_ITEMS: MediaActionCardItemType[] = [
  {
    id: "action-1",
    title: "Seasonal Flash Sale Campaign",
    description:
      "Launch a limited-time sitewide discount banner with sticky countdown timer and automated inventory countdown reservation.",
    imageUrl:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Online shopping sale banner with discounts and gifts",
    badge: {
      text: "Campaign",
      tone: "warning",
    },
    metaText: "Starts in 3 days",
    primaryAction: {
      content: "Activate campaign",
    },
    secondaryAction: {
      content: "Customize rules",
    },
  },
  {
    id: "action-2",
    title: "Abandoned Cart Recovery Flow",
    description:
      "Send intelligent multi-channel SMS and email reminder sequences with dynamic one-click discount codes to recapture lost checkouts.",
    imageUrl:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Digital payment and shopping cart checkout process",
    badge: {
      text: "Automation",
      tone: "success",
    },
    metaText: "Recovers 22% of carts",
    primaryAction: {
      content: "Enable sequence",
    },
    secondaryAction: {
      content: "Edit template",
    },
  },
  {
    id: "action-3",
    title: "VIP Tier Loyalty Rewards",
    description:
      "Reward repeat spenders with exclusive perks, early product drops, and automated points redemption right on the cart drawer.",
    imageUrl:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Loyalty rewards card and VIP customer benefits",
    badge: {
      text: "Retention",
      tone: "info",
    },
    metaText: "1,450 active VIPs",
    primaryAction: {
      content: "Configure perks",
    },
    secondaryAction: {
      content: "View members",
    },
  },
];

export function CardsMediaActionExample() {
  const [activeAction, setActiveAction] = React.useState<string | null>(null);

  return (
    <BlockStack gap="base">
      {activeAction && (
        <Banner tone="success" onDismiss={() => setActiveAction(null)}>
          <Text variant="bodyMd">{activeAction}</Text>
        </Banner>
      )}

      <Box>
        <Text variant="bodyMd" color="subdued">
          Media Action cards combine impactful visual assets with prominent primary and secondary call-to-action buttons. Ideal for marketing campaigns, workflow templates, and high-converting app blocks.
        </Text>
      </Box>

      <Grid columns={{ sm: 1, md: 3 }} gap="base">
        {MEDIA_ACTION_CARD_ITEMS.map((item) => (
          <MediaActionCard
            key={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl!}
            imageAlt={item.imageAlt}
            badge={item.badge}
            metaText={item.metaText}
            primaryAction={{
              content: item.primaryAction!.content,
              onAction: () => setActiveAction(`Executed: ${item.primaryAction!.content} for "${item.title}"`),
            }}
            secondaryAction={{
              content: item.secondaryAction!.content,
              onAction: () => setActiveAction(`Opened: ${item.secondaryAction!.content} for "${item.title}"`),
            }}
            onOptionsClick={() => setActiveAction(`More options for "${item.title}"`)}
          />
        ))}
      </Grid>
    </BlockStack>
  );
}
