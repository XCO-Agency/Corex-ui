import * as React from "react";
import {
  Box,
  BlockStack,
  Grid,
  Text,
  Banner,
} from "@xco-agency/corex-ui";
import { MediaActionCard } from "../partials/MediaActionCard";
import { MEDIA_ACTION_CARD_ITEMS } from "../constants";

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
