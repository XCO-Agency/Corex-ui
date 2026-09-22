import * as React from "react";
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import { RecommendationItem, type RecommendationItemType } from "./RecommendationItem";

export const DEFAULT_AI_RECOMMENDATIONS: RecommendationItemType[] = [
  {
    id: "fbt-bundle",
    title: "Launch 'Frequently Bought Together' Bundle",
    description:
      "Pair your best-selling product with 1-2 complementary items to offer a 1-click bundle discount on the product page.",
    liftBadge: {
      text: "+12.5%",
      tone: "success",
    },
    actionType: "create_fbt",
    primaryAction: {
      label: "Launch bundle",
    },
    secondaryAction: {
      label: "Preview",
    },
  },
  {
    id: "shipping-protection",
    title: "Add Shipping Protection Add-On ($1.99)",
    description:
      "A zero-inventory micro-upsell with 95%+ profit margin. Over 34% of shoppers opt in for package guarantee.",
    liftBadge: {
      text: "+$1.85",
      tone: "success",
    },
    actionType: "create_addon",
    primaryAction: {
      label: "Add protection",
    },
    secondaryAction: {
      label: "Configure",
    },
  },
  {
    id: "post-purchase-funnel",
    title: "Enable 1-Click Post-Purchase Funnel",
    description:
      "Show a limited-time 20% off offer right after payment before the thank you page with zero friction (1-click tokenized charge).",
    liftBadge: {
      text: "+8.4%",
      tone: "success",
    },
    actionType: "enable_post_purchase",
    primaryAction: {
      label: "Enable funnel",
    },
    secondaryAction: {
      label: "Customize",
    },
  },
];

export type AiRecommendationsPropsType = {
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
  items?: RecommendationItemType[];
  onItemAction?: (item: RecommendationItemType) => void;
  onItemDismiss?: (id: string) => void;
  onDismiss?: () => void;
};

export function AiRecommendations({
  title = "AI recommendations",
  subtitle = "Order history basket mining and high-impact revenue opportunities for your store.",
  badgeLabel = "AI strategy copilot",
  items = DEFAULT_AI_RECOMMENDATIONS,
  onItemAction,
  onItemDismiss,
  onDismiss,
}: AiRecommendationsPropsType) {
  return (
    <Card
      heading={title}
      description={subtitle}
      actions={
        <InlineStack gap="small-200" alignItems="center">
          {badgeLabel && <Badge tone="info">{badgeLabel}</Badge>}
          {onDismiss && (
            <Button
              variant="tertiary"
              icon="x"
              accessibilityLabel="Dismiss recommendations"
              onClick={onDismiss}
            />
          )}
        </InlineStack>
      }
    >
      {items.length > 0 ? (
        <BlockStack gap="small-300">
          {items.map((item) => (
            <RecommendationItem
              key={item.id}
              item={item}
              onAction={onItemAction}
              onDismiss={onItemDismiss}
            />
          ))}
        </BlockStack>
      ) : (
        <Box
          padding="base"
          borderRadius="large"
          background="bg-surface-secondary"
        >
          <InlineStack justifyContent="center">
            <Text as="p" color="subdued">
              No active recommendations — check back as new orders come in.
            </Text>
          </InlineStack>
        </Box>
      )}
    </Card>
  );
}
