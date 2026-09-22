import * as React from "react";
import { BlockStack, InlineStack, Button, Text, Box } from "@xco-agency/corex-ui";
import {
  AiRecommendations,
  DEFAULT_AI_RECOMMENDATIONS,
} from "./AiRecommendations";
import type { RecommendationItemType } from "./RecommendationItem";

export function AiRecommendationsExample() {
  const [items, setItems] = React.useState<RecommendationItemType[]>(
    DEFAULT_AI_RECOMMENDATIONS
  );
  const [isDismissed, setIsDismissed] = React.useState(false);

  const handleDismissItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setItems(DEFAULT_AI_RECOMMENDATIONS);
    setIsDismissed(false);
  };

  return (
    <BlockStack gap="base">
      {!isDismissed ? (
        <AiRecommendations
          items={items}
          onItemDismiss={handleDismissItem}
          onDismiss={() => setIsDismissed(true)}
        />
      ) : (
        <Box
          padding="base"
          background="bg-surface-secondary"
          borderRadius="large"
        >
          <InlineStack justifyContent="space-between" alignItems="center">
            <Text color="subdued">Recommendations card was dismissed.</Text>
            <Button variant="secondary" onClick={() => setIsDismissed(false)}>
              Restore Card
            </Button>
          </InlineStack>
        </Box>
      )}

      <InlineStack justifyContent="space-between" alignItems="center">
        <Text variant="bodySm" color="subdued">
          Interactive demo: {items.length} recommendations available.
        </Text>
        <Button variant="tertiary" onClick={handleReset}>
          Reset Recommendations
        </Button>
      </InlineStack>
    </BlockStack>
  );
}
