import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  TextField,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import type { RewardTierType } from "../types";

type MilestoneRewardCardPropsType = {
  enabled: boolean;
  tiers: RewardTierType[];
  onToggleEnabled: (enabled: boolean) => void;
  onUpdateTier: (tierId: string, updates: Partial<RewardTierType>) => void;
  onAddTier: () => void;
  onRemoveTier: (tierId: string) => void;
};

export function MilestoneRewardCard({
  enabled,
  tiers,
  onToggleEnabled,
  onUpdateTier,
  onAddTier,
  onRemoveTier,
}: MilestoneRewardCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <InlineStack gap="small-200" alignItems="center">
              <Text as="h3" fontWeight="semibold">
                Free Shipping & Reward Milestones
              </Text>
              <Badge tone={enabled ? "success" : "neutral"}>
                {enabled ? "Active" : "Disabled"}
              </Badge>
            </InlineStack>
            <Text color="subdued" variant="bodySm">
              Motivate customers to increase basket size by unlocking progressive rewards.
            </Text>
          </BlockStack>
          <Button
            variant={enabled ? "secondary" : "primary"}
            onClick={() => onToggleEnabled(!enabled)}
          >
            {enabled ? "Disable Milestones" : "Enable Milestones"}
          </Button>
        </InlineStack>

        {enabled && (
          <BlockStack gap="base">
            <Divider />

            {/* Visual Progress Preview Simulation */}
            <Box
              padding="base"
              background="subdued"
              borderRadius="base"
              borderWidth="small-100"
              borderColor="subdued"
              borderStyle="solid"
            >
              <BlockStack gap="small-200">
                <InlineStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="semibold" variant="bodySm">
                    Cart Progress Preview (Simulated Cart: $72.50)
                  </Text>
                  <Text color="subdued" variant="bodySm">
                    Next goal: $100.00
                  </Text>
                </InlineStack>

                {/* Progress Bar */}
                <div
                  style={{
                    position: "relative",
                    height: "8px",
                    width: "100%",
                    borderRadius: "4px",
                    background: "var(--p-color-bg-surface-secondary, #e4e5e7)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "72.5%",
                      borderRadius: "4px",
                      background: "var(--p-color-bg-fill-success, #108043)",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>

                <InlineStack justifyContent="space-between" alignItems="center">
                  <Text color="subdued" variant="bodySm">
                    Unlocked: Free Shipping 🎉
                  </Text>
                  <Text color="subdued" variant="bodySm">
                    Add $27.50 to unlock Free Travel Pouch
                  </Text>
                </InlineStack>
              </BlockStack>
            </Box>

            {/* Configured Tiers */}
            <BlockStack gap="small-200">
              <Text fontWeight="semibold" variant="bodySm">
                Reward Tiers
              </Text>

              {tiers.map((tier, index) => (
                <Box
                  key={tier.id}
                  padding="small"
                  background="base"
                  borderRadius="base"
                  borderWidth="small-100"
                  borderColor="subdued"
                  borderStyle="solid"
                >
                  <InlineStack gap="base" alignItems="center" justifyContent="space-between">
                    <Box inlineSize="70px">
                      <Badge tone="info">Tier {index + 1}</Badge>
                    </Box>

                    <Box inlineSize="140px">
                      <TextField
                        label="Spend Threshold"
                        type="number"
                        prefix="$"
                        value={String(tier.threshold)}
                        onChange={(val) =>
                          onUpdateTier(tier.id, { threshold: Number(val) || 0 })
                        }
                      />
                    </Box>

                    <div style={{ flex: 1 }}>
                      <TextField
                        label="Reward Name"
                        value={tier.rewardTitle}
                        onChange={(val) =>
                          onUpdateTier(tier.id, { rewardTitle: val })
                        }
                      />
                    </div>

                    <Button
                      variant="plain"
                      tone="critical"
                      icon="delete"
                      onClick={() => onRemoveTier(tier.id)}
                      disabled={tiers.length <= 1}
                    >
                      Remove
                    </Button>
                  </InlineStack>
                </Box>
              ))}

              <InlineStack justifyContent="flex-start">
                <Button variant="secondary" icon="plus" onClick={onAddTier}>
                  Add Milestone Tier
                </Button>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
}
