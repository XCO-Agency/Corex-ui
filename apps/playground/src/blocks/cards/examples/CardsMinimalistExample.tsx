import * as React from "react";
import {
  Box,
  BlockStack,
  Grid,
  Text,
  Banner,
} from "@xco-agency/corex-ui";
import { MinimalistCard } from "../partials/MinimalistCard";
import { MINIMALIST_CARD_ITEMS } from "../constants";

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
