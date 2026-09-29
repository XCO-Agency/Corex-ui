import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Divider,
  InlineStack,
  Text,
  Thumbnail,
} from "@xco-agency/corex-ui";

export interface CartExampleItemType {
  id: string;
  title: string;
  variant?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image: string;
}

const INITIAL_ITEMS: CartExampleItemType[] = [
  {
    id: "1",
    title: "Essential Oversized Tee",
    variant: "Black / Large",
    price: 29,
    compareAtPrice: 36,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
  },
  {
    id: "2",
    title: "Relaxed Everyday Pants",
    variant: "Stone / 32",
    price: 64,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
  },
];

const UPSELL_ITEM: CartExampleItemType = {
  id: "upsell-beanie",
  title: "Merino Wool Beanie",
  variant: "Charcoal / One Size",
  price: 18,
  compareAtPrice: 24,
  quantity: 1,
  image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80",
};

export function CartDrawerExample() {
  const [items, setItems] = useState<CartExampleItemType[]>(INITIAL_ITEMS);
  const [upsellAdded, setUpsellAdded] = useState(false);
  const [checkoutFeedback, setCheckoutFeedback] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 100;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgressPct = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100),
  );
  const isFreeShippingUnlocked = remainingForFreeShipping === 0;

  const handleQuantityChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (id === UPSELL_ITEM.id) {
      setUpsellAdded(false);
    }
  };

  const handleToggleUpsell = () => {
    if (upsellAdded) {
      setItems((prev) => prev.filter((item) => item.id !== UPSELL_ITEM.id));
      setUpsellAdded(false);
    } else {
      setItems((prev) => [...prev, UPSELL_ITEM]);
      setUpsellAdded(true);
    }
  };

  const handleCheckout = () => {
    setCheckoutFeedback(true);
    setTimeout(() => setCheckoutFeedback(false), 2000);
  };

  return (
    <Box
      inlineSize="100%"
      maxInlineSize="400px"
      background="bg-surface"
      borderWidth="0165"
      borderColor="border"
      borderRadius="large"
      overflow="hidden"
      shadow="100"
    >
      {/* 1. Contextual Announcement Banner */}
      <Box
        paddingBlock="small-300"
        paddingInline="base"
        background="bg-surface-secondary"
      >
        <InlineStack justifyContent="center">
          <Text variant="bodySm" tone="success" fontWeight="semibold">
            ✦ Free express delivery unlocked on all orders
          </Text>
        </InlineStack>
      </Box>

      {/* 2. Header */}
      <Box padding="base" borderBlockEndWidth="0165" borderColor="border">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="none">
            <Text variant="bodySm" color="subdued" fontWeight="semibold">
              YOUR SELECTION
            </Text>
            <Text variant="headingMd" heading>
              Your Cart
            </Text>
          </BlockStack>
          <Badge tone="neutral">{items.length} items</Badge>
        </InlineStack>
      </Box>

      {/* 3. Free Shipping Tier Progress */}
      <Box
        paddingBlock="small-200"
        paddingInline="base"
        background="bg-surface-secondary"
        borderBlockEndWidth="0165"
        borderColor="border"
      >
        <BlockStack gap="small-200">
          <Text variant="bodySm">
            {isFreeShippingUnlocked ? (
              <Text as="span" tone="success" fontWeight="bold">
                🎉 You unlocked FREE Shipping!
              </Text>
            ) : (
              <Text as="span" color="subdued">
                Add <Text as="span" fontWeight="bold">${remainingForFreeShipping.toFixed(2)}</Text> more to unlock FREE Shipping
              </Text>
            )}
          </Text>
          <Box
            inlineSize="100%"
            blockSize="6px"
            background="bg-surface-tertiary"
            borderRadius="full"
            overflow="hidden"
          >
            <Box
              inlineSize={`${shippingProgressPct}%`}
              blockSize="100%"
              background="bg-fill-success"
              borderRadius="full"
            />
          </Box>
        </BlockStack>
      </Box>

      {/* 4. Cart Items */}
      <Box padding="base" maxBlockSize="320px" overflowY="auto">
        <BlockStack gap="base">
          {items.map((item) => (
            <InlineStack key={item.id} gap="base" alignItems="flex-start">
              <Thumbnail size="small" source={item.image} alt={item.title} />

              <BlockStack gap="small-200" inlineSize="fill">
                <InlineStack justifyContent="space-between" alignItems="flex-start">
                  <BlockStack gap="none">
                    <Text variant="bodyMd" fontWeight="semibold">
                      {item.title}
                    </Text>
                    {item.variant && (
                      <Text variant="bodySm" color="subdued">
                        {item.variant}
                      </Text>
                    )}
                  </BlockStack>

                  <Button
                    variant="plain"
                    tone="critical"
                    onClick={() => handleRemove(item.id)}
                  >
                    ×
                  </Button>
                </InlineStack>

                <InlineStack justifyContent="space-between" alignItems="center">
                  <InlineStack gap="small-300" alignItems="center">
                    <Button
                      variant="secondary"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </Button>
                    <Text variant="bodySm" fontWeight="semibold">
                      {item.quantity}
                    </Text>
                    <Button
                      variant="secondary"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </Button>
                  </InlineStack>

                  <Text variant="bodyMd" fontWeight="bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </InlineStack>
              </BlockStack>
            </InlineStack>
          ))}

          {/* 5. In-Cart Recommendation Upsell */}
          <Divider />
          <Box
            padding="small-200 base"
            background="bg-surface-secondary"
            borderRadius="base"
          >
            <InlineStack justifyContent="space-between" alignItems="center">
              <InlineStack gap="small-200" alignItems="center">
                <Thumbnail size="small" source={UPSELL_ITEM.image} alt={UPSELL_ITEM.title} />
                <BlockStack gap="none">
                  <Text variant="bodySm" fontWeight="semibold">
                    {UPSELL_ITEM.title}
                  </Text>
                  <Text variant="bodySm" color="subdued">
                    ${UPSELL_ITEM.price.toFixed(2)}
                  </Text>
                </BlockStack>
              </InlineStack>

              <Button
                variant={upsellAdded ? "secondary" : "primary"}
                onClick={handleToggleUpsell}
              >
                {upsellAdded ? "✓ Added" : "+ Add"}
              </Button>
            </InlineStack>
          </Box>
        </BlockStack>
      </Box>

      {/* 6. Footer & Order Summary */}
      <Box
        padding="base"
        borderBlockStartWidth="0165"
        borderColor="border"
        background="bg-surface"
      >
        <BlockStack gap="base">
          <InlineStack justifyContent="space-between" alignItems="center">
            <Text variant="bodyMd" color="subdued">
              Subtotal
            </Text>
            <Text variant="headingSm" heading>
              ${subtotal.toFixed(2)}
            </Text>
          </InlineStack>

          <Button
            variant="primary"
            fullWidth
            onClick={handleCheckout}
            loading={checkoutFeedback}
          >
            {checkoutFeedback ? "Processing..." : `Checkout • $${subtotal.toFixed(2)}`}
          </Button>

          <InlineStack justifyContent="center" gap="small-200">
            <Badge tone="neutral">🛡️ 256-Bit SSL</Badge>
            <Badge tone="neutral">⚡ Fast Dispatch</Badge>
            <Badge tone="neutral">↺ 30-Day Returns</Badge>
          </InlineStack>
        </BlockStack>
      </Box>
    </Box>
  );
}
