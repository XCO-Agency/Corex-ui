import * as React from "react";
import { Page, BlockStack, Grid } from "@xco-agency/corex-ui";
import { SelectableCard } from "../partials/SelectableCard";
import { SHOWCASE_CARD_ITEMS } from "../constants";

export function CardsOverviewExample() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([
    "template-minimalist",
    "template-actions",
  ]);

  const toggleTemplate = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <Page>
      <BlockStack gap="base">
        <Grid columns={{ sm: 1, md: 4 }} gap="base">
          {SHOWCASE_CARD_ITEMS.map((item) => (
            <SelectableCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl!}
              imageAlt={item.imageAlt}
              selected={selectedIds.includes(item.id)}
              onSelectChange={() => toggleTemplate(item.id)}
            />
          ))}
        </Grid>
      </BlockStack>
    </Page>
  );
}
