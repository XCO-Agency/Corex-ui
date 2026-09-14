import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Select,
  Checkbox,
  Divider,
} from "@xco-agency/corex-ui";

type TargetCollectionsCardPropsType = {
  appliesTo: "all_products" | "specific_collections";
  collections: string[];
  combinesWithShipping: boolean;
  combinesWithProductDiscounts: boolean;
  onUpdateAppliesTo: (val: "all_products" | "specific_collections") => void;
  onRemoveCollection: (name: string) => void;
  onAddCollection: () => void;
  onUpdateCombinesShipping: (val: boolean) => void;
  onUpdateCombinesProducts: (val: boolean) => void;
};

export function TargetCollectionsCard({
  appliesTo,
  collections,
  combinesWithShipping,
  combinesWithProductDiscounts,
  onUpdateAppliesTo,
  onRemoveCollection,
  onAddCollection,
  onUpdateCombinesShipping,
  onUpdateCombinesProducts,
}: TargetCollectionsCardPropsType) {
  const scopeOptions = [
    { label: "Specific collections only", value: "specific_collections" },
    { label: "All products in store", value: "all_products" },
  ];

  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="small-400">
          <Text as="h3" fontWeight="semibold">
            Applies To & Combinations
          </Text>
          <Text color="subdued" variant="bodySm">
            Choose which catalog items trigger this tiered volume pricing.
          </Text>
        </BlockStack>

        <Select
          label="Catalog Scope"
          value={appliesTo}
          options={scopeOptions}
          onChange={(val) =>
            onUpdateAppliesTo(val as "all_products" | "specific_collections")
          }
        />

        {appliesTo === "specific_collections" && (
          <BlockStack gap="small-200">
            <Text variant="bodySm" fontWeight="semibold">
              Selected Collections
            </Text>
            <InlineStack gap="small-200" wrap>
              {collections.map((name) => (
                <Badge key={name} tone="info">
                  {name}
                </Badge>
              ))}
            </InlineStack>
            <InlineStack justifyContent="flex-start">
              <Button variant="secondary" icon="search" onClick={onAddCollection}>
                Browse Collections
              </Button>
            </InlineStack>
          </BlockStack>
        )}

        <Divider />

        <BlockStack gap="small-200">
          <Text variant="bodySm" fontWeight="semibold">
            Discount Combinations
          </Text>
          <Checkbox
            label="Combine with free shipping discounts"
            checked={combinesWithShipping}
            onChange={onUpdateCombinesShipping}
          />
          <Checkbox
            label="Combine with other product discounts"
            checked={combinesWithProductDiscounts}
            onChange={onUpdateCombinesProducts}
          />
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
