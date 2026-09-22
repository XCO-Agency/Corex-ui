import * as React from "react";
import { Page, BlockStack, Grid } from "@xco-agency/corex-ui";
import { SelectableCard } from "../partials/SelectableCard";

export type CardItemDataType = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
};
export const SHOWCASE_CARD_ITEMS: CardItemDataType[] = [
  {
    id: "template-minimalist",
    title: "Minimalist Streamlined",
    description: "Ultra-fast text-first layout with instant cart loading.",
    imageUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Minimalist modern storefront layout",
  },
  {
    id: "template-media",
    title: "Visual Editorial",
    description: "Rich photography showcase for apparel and lifestyle brands.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Visual editorial apparel storefront",
  },
  {
    id: "template-actions",
    title: "High-Converting Promo",
    description: "Dynamic countdowns, automated upsells, and instant checkout CTAs.",
    imageUrl:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Interactive online checkout and transaction terminal",
  },
];

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
