import { useState } from "react";
import {
  Table,
  Badge,
  Text,
  InlineStack,
  Card,
  Avatar,
  Button,
} from "@xco-agency/corex-ui";
import { BlockStack } from "@xco-agency/corex-ui";

type CartVariantType = {
  id: string;
  name: string;
  variantLetter: string;
  visitors: string;
  conversionRate: string;
  aov: string;
  totalRevenue: string;
  statusText?: string;
  statusTone?: "success" | "warning" | "info" | "neutral";
};

type CartItemType = {
  id: string;
  name: string;
  created: string;
  visitors: string;
  conversionRate: string;
  aov: string;
  totalRevenue: string;
  isDefault?: boolean;
  hasAbTest?: boolean;
  variants?: CartVariantType[];
};

const cartsData: CartItemType[] = [
  {
    id: "cart-1",
    name: "Black Friday Cart",
    created: "Nov 15, 2025",
    visitors: "14,820",
    conversionRate: "4.8%",
    aov: "$86.50",
    totalRevenue: "$61,420",
    hasAbTest: true,
    variants: [
      {
        id: "v-1a",
        name: "Variant A (Free Shipping Bar)",
        variantLetter: "A",
        visitors: "7,410",
        conversionRate: "5.2%",
        aov: "$89.00",
        totalRevenue: "$34,280",
        statusText: "Winning",
        statusTone: "success",
      },
      {
        id: "v-1b",
        name: "Variant B (Tiered Discounts)",
        variantLetter: "B",
        visitors: "7,410",
        conversionRate: "4.4%",
        aov: "$84.00",
        totalRevenue: "$27,140",
      },
    ],
  },
  {
    id: "cart-2",
    name: "Default Slide Drawer",
    created: "Oct 02, 2025",
    visitors: "8,340",
    conversionRate: "3.9%",
    aov: "$74.00",
    totalRevenue: "$24,010",
    isDefault: true,
  },
  {
    id: "cart-3",
    name: "Summer Sale Drawer",
    created: "Jun 10, 2025",
    visitors: "19,250",
    conversionRate: "4.1%",
    aov: "$68.20",
    totalRevenue: "$53,890",
    hasAbTest: true,
    variants: [
      {
        id: "v-3a",
        name: "Variant A (In-Cart Upsells)",
        variantLetter: "A",
        visitors: "9,625",
        conversionRate: "4.3%",
        aov: "$72.00",
        totalRevenue: "$29,780",
      },
      {
        id: "v-3b",
        name: "Variant B (Sticky Checkout)",
        variantLetter: "B",
        visitors: "9,625",
        conversionRate: "3.9%",
        aov: "$64.40",
        totalRevenue: "$24,110",
      },
    ],
  },
];

export function TableExample() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["cart-1"]));

  const toggleExpanded = (cartId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cartId)) {
        next.delete(cartId);
      } else {
        next.add(cartId);
      }
      return next;
    });
  };

  return (
    <BlockStack inlineSize="100%" maxInlineSize="760px">
      <Card padding="none">
        <Table variant="auto">
          <Table.HeaderRow>
            <Table.Header listSlot="primary">Cart</Table.Header>
            <Table.Header format="numeric" tooltip="Visitors tooltip">
              Visitors
            </Table.Header>
            <Table.Header format="numeric">Conv. Rate</Table.Header>
            <Table.Header format="currency">AOV</Table.Header>
            <Table.Header format="currency">Total Rev.</Table.Header>
            <Table.Header listSlot="inline">Status</Table.Header>
          </Table.HeaderRow>

          <Table.Body>
            {cartsData.flatMap((cart) => {
              const hasSubrows = Boolean(cart.variants && cart.variants.length > 0);
              const isExpanded = hasSubrows && expanded.has(cart.id);
              const clickId = `cart-link-${cart.id}`;
              const parentRow = (
                <Table.Row key={cart.id} clickDelegate={clickId}>
                  {/* Cart Column */}
                  <Table.Cell>
                    <InlineStack alignItems="center" gap="small-500">
                      {hasSubrows ? (
                        <Table.ExpandButton
                          expanded={isExpanded}
                          onToggle={() => toggleExpanded(cart.id)}
                          accessibilityLabel={
                            isExpanded ? "Collapse variants" : "Expand variants"
                          }
                        />
                      ) : (
                        <span
                          style={{ width: 28, display: "inline-block", flexShrink: 0 }}
                        />
                      )}
                      <Button
                        variant="tertiary"
                        id={clickId}
                        onClick={() => alert("Parent row clicked")}
                      >
                        {cart.name}
                      </Button>
                      {cart.isDefault && <Badge tone="info">Default</Badge>}
                      {cart.hasAbTest && <Badge tone="success">A/B</Badge>}
                    </InlineStack>
                  </Table.Cell>

                  {/* Metrics Columns */}
                  <Table.Cell>{cart.visitors}</Table.Cell>
                  <Table.Cell>{cart.conversionRate}</Table.Cell>
                  <Table.Cell>{cart.aov}</Table.Cell>
                  <Table.Cell>
                    <strong>{cart.totalRevenue}</strong>
                  </Table.Cell>

                  {/* Status Column */}
                  <Table.Cell>
                    <Badge tone="info">Active</Badge>
                  </Table.Cell>
                </Table.Row>
              );

              const childRows =
                isExpanded && cart.variants
                  ? cart.variants.map((variant, idx) => (
                      <Table.Row
                        key={`${cart.id}-variant-${variant.id}`}
                        onClick={() => alert("Child row clicked")}
                      >
                        {/* Subrow Cart / Variant Column */}
                        <Table.Cell>
                          <InlineStack alignItems="center" gap="small-200">
                            <Table.SubRowConnector
                              isLast={idx === cart.variants!.length - 1}
                            />
                            <Avatar initials={variant.variantLetter} size="small-200" />
                            <Text as="span">{variant.name}</Text>
                          </InlineStack>
                        </Table.Cell>

                        {/* Subrow Metrics Columns */}
                        <Table.Cell>{variant.visitors}</Table.Cell>
                        <Table.Cell>{variant.conversionRate}</Table.Cell>
                        <Table.Cell>{variant.aov}</Table.Cell>
                        <Table.Cell>
                          <Text heading>{variant.totalRevenue}</Text>
                        </Table.Cell>

                        {/* Subrow Status Column */}
                        <Table.Cell>
                          {variant.statusText && (
                            <Badge tone={variant.statusTone ?? "neutral"}>
                              {variant.statusText}
                            </Badge>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  : [];

              return [parentRow, ...childRows];
            })}
          </Table.Body>
        </Table>
      </Card>
    </BlockStack>
  );
}
