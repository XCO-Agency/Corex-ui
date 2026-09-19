import * as React from "react";
import {
  Box,
  BlockStack,
  Grid,
  Text,
  Banner,
} from "@xco-agency/corex-ui";
import { MediaCard } from "../partials/MediaCard";
import { MEDIA_CARD_ITEMS } from "../constants";

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
