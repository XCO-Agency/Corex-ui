import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  TextField,
  NumberField,
  Select,
  Table,
  Divider,
} from "@xco-agency/corex-ui";
import type { DiscountTierType, DiscountType } from "../types";

type DiscountTiersCardPropsType = {
  tiers: DiscountTierType[];
  onUpdateTier: (id: string, updates: Partial<DiscountTierType>) => void;
  onAddTier: () => void;
  onRemoveTier: (id: string) => void;
};

export function DiscountTiersCard({
  tiers,
  onUpdateTier,
  onAddTier,
  onRemoveTier,
}: DiscountTiersCardPropsType) {
  const typeOptions = [
    { label: "Percentage off (%)", value: "percentage" },
    { label: "Fixed amount off ($)", value: "fixed_amount" },
  ];

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Quantity Break Tiers
            </Text>
            <Text color="subdued" variant="small">
              Define the minimum quantities and corresponding discounts customers receive.
            </Text>
          </BlockStack>
          <Badge tone="info">{tiers.length} Tiers Configured</Badge>
        </InlineStack>

        <Divider />

        <Table>
          <Table.HeaderRow>
            <Table.Header>Tier</Table.Header>
            <Table.Header>Min. Quantity</Table.Header>
            <Table.Header>Discount Type</Table.Header>
            <Table.Header>Discount Value</Table.Header>
            <Table.Header>Badge Label (Optional)</Table.Header>
            <Table.Header>Actions</Table.Header>
          </Table.HeaderRow>
          <Table.Body>
            {tiers.map((tier, idx) => (
              <Table.Row key={tier.id}>
                <Table.Cell>
                  <Badge tone={tier.highlighted ? "success" : "neutral"}>
                    Tier {idx + 1}
                  </Badge>
                </Table.Cell>

                <Table.Cell>
                  <div style={{ maxWidth: "110px" }}>
                    <NumberField
                      label="Minimum Quantity"
                      labelAccessibilityVisibility="exclusive"
                      value={String(tier.minQuantity)}
                      min={1}
                      onChange={(val) =>
                        onUpdateTier(tier.id, {
                          minQuantity: Math.max(1, Number(val) || 1),
                        })
                      }
                    />
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <div style={{ minWidth: "170px" }}>
                    <Select
                      label="Discount Type"
                      labelAccessibilityVisibility="exclusive"
                      value={tier.discountType}
                      options={typeOptions}
                      onChange={(val) =>
                        onUpdateTier(tier.id, {
                          discountType: val as DiscountType,
                        })
                      }
                    />
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <div style={{ maxWidth: "120px" }}>
                    <NumberField
                      label="Discount Value"
                      labelAccessibilityVisibility="exclusive"
                      prefix={
                        tier.discountType === "fixed_amount" ? "$" : undefined
                      }
                      suffix={
                        tier.discountType === "percentage" ? "%" : undefined
                      }
                      value={String(tier.discountValue)}
                      min={0}
                      onChange={(val) =>
                        onUpdateTier(tier.id, {
                          discountValue: Math.max(0, Number(val) || 0),
                        })
                      }
                    />
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <div style={{ minWidth: "140px" }}>
                    <TextField
                      label="Badge Label"
                      labelAccessibilityVisibility="exclusive"
                      placeholder="e.g. Popular"
                      value={tier.badgeLabel ?? ""}
                      onChange={(val) =>
                        onUpdateTier(tier.id, { badgeLabel: val })
                      }
                    />
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <Button
                    variant="tertiary"
                    tone="critical"
                    disabled={tiers.length <= 1}
                    onClick={() => onRemoveTier(tier.id)}
                  >
                    Remove
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <InlineStack justifyContent="flex-start">
          <Button variant="secondary" onClick={onAddTier}>
            + Add Tier Break
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
