import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Thumbnail,
  Button,
  Divider,
} from "@xco-agency/corex-ui";
import type { OfferTargetProductsCardPropsType } from "../types";

export function OfferTargetProductsCard({
  selectedProducts,
  availableProducts,
  onAddProduct,
  onRemoveProduct,
}: OfferTargetProductsCardPropsType) {
  const [showPicker, setShowPicker] = React.useState(false);

  const unselectedProducts = availableProducts.filter(
    (p) => !selectedProducts.some((sp) => sp.id === p.id),
  );

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="small-200"
        >
          <BlockStack gap="none">
            <Text variant="base" heading>
              Featured add-on products ({selectedProducts.length})
            </Text>
            <Text variant="small" tone="neutral">
              Products rendered directly inside the cart drawer upsell carousel.
            </Text>
          </BlockStack>

          <Button
            variant="secondary"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            {showPicker ? "Close picker" : "Browse products"}
          </Button>
        </InlineStack>

        {/* Picker Tray */}
        {showPicker && (
          <div
            style={{
              background: "var(--p-color-bg-surface-secondary)",
              padding: "16px",
              borderRadius: "var(--p-border-radius-100)",
              border: "1px solid var(--p-color-border-subdued)",
            }}
          >
            <BlockStack gap="small-300">
              <Text variant="xs" tone="neutral">
                AVAILABLE CATALOG PRODUCTS:
              </Text>

              {unselectedProducts.length === 0 ? (
                <Text variant="small" tone="neutral">
                  All available catalog products have been selected.
                </Text>
              ) : (
                unselectedProducts.map((prod) => (
                  <InlineStack
                    key={prod.id}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <InlineStack gap="small-200" alignItems="center">
                      {prod.imageUrl && (
                        <Thumbnail src={prod.imageUrl} alt={prod.title} size="small" />
                      )}
                      <BlockStack gap="none">
                        <Text variant="small" heading>
                          {prod.title}
                        </Text>
                        <Text variant="xs" tone="neutral">
                          {prod.price} • {prod.sku}
                        </Text>
                      </BlockStack>
                    </InlineStack>

                    <Button
                      variant="secondary"
                      onClick={() => onAddProduct(prod.id)}
                    >
                      Add
                    </Button>
                  </InlineStack>
                ))
              )}
            </BlockStack>
          </div>
        )}

        {/* Selected Products List */}
        {selectedProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <Text variant="small" tone="neutral">
              No products selected. Click "Browse products" to add items.
            </Text>
          </div>
        ) : (
          <BlockStack gap="small-200">
            {selectedProducts.map((prod, idx) => (
              <React.Fragment key={prod.id}>
                {idx > 0 && <Divider />}

                <InlineStack
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <InlineStack gap="small-300" alignItems="center">
                    {prod.imageUrl && (
                      <Thumbnail src={prod.imageUrl} alt={prod.title} size="small" />
                    )}
                    <BlockStack gap="none">
                      <Text variant="small" heading>
                        {prod.title}
                      </Text>
                      <Text variant="xs" tone="neutral">
                        {prod.price} • {prod.sku}
                      </Text>
                    </BlockStack>
                  </InlineStack>

                  <Button
                    variant="tertiary"
                    tone="critical"
                    onClick={() => onRemoveProduct(prod.id)}
                  >
                    Remove
                  </Button>
                </InlineStack>
              </React.Fragment>
            ))}
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
}
