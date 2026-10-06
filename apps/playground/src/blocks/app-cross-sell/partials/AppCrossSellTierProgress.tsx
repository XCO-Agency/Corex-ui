import * as React from "react";
import {
  Badge,
  BlockStack,
  Box,
  Icon,
  InlineStack,
  ProgressBar,
  Text,
} from "@xco-agency/corex-ui";
import type { DiscountTierType } from "../types";
import { getNextTier, getReachedTier, pluralizeApps } from "../utils";

export type AppCrossSellTierProgressPropsType = {
  tiers: DiscountTierType[];
  installedCount?: number;
};

/** Discount progress: current tier, what is left to unlock, and the tier milestones. */
export function AppCrossSellTierProgress({
  tiers,
  installedCount = 0,
}: AppCrossSellTierProgressPropsType) {
  const reached = getReachedTier(tiers, installedCount);
  const next = getNextTier(tiers, installedCount);
  const target = tiers[tiers.length - 1]?.appsCount ?? 1;

  return (
    <BlockStack gap="small-200">
      <InlineStack
        justifyContent="space-between"
        alignItems="center"
        gap="small-200"
        wrap
      >
        <InlineStack gap="small-200" alignItems="center">
          <Text variant="bodySm" fontWeight="semibold">
            {`${pluralizeApps(installedCount)} installed`}
          </Text>
          {reached ? (
            <Badge tone="success">{`${reached.discountPercent}% discount active`}</Badge>
          ) : (
            <Badge tone="neutral">No discount yet</Badge>
          )}
        </InlineStack>

        <Text variant="bodySm" color="subdued">
          {next
            ? `Install ${pluralizeApps(next.appsCount - installedCount)} more to unlock ${next.discountPercent}% off`
            : "Maximum discount unlocked"}
        </Text>
      </InlineStack>

      <ProgressBar
        value={Math.min(installedCount, target)}
        max={target}
        tone={next ? "info" : "success"}
        accessibilityLabel="Apps installed toward the next discount"
      />

      <InlineStack
        justifyContent="space-between"
        alignItems="center"
        gap="small-200"
        wrap
      >
        {tiers.map((tier, index) => {
          const isReached = installedCount >= tier.appsCount;

          return (
            <React.Fragment key={tier.id}>
              <Box
                background={isReached ? "subdued" : "base"}
                borderWidth="small-100"
                borderColor={isReached ? "base" : "subdued"}
                borderRadius="large-100"
                padding="small-200 base"
              >
                <InlineStack gap="small-200" alignItems="center">
                  {isReached ? <Icon type="check" size="small" tone="success" /> : null}
                  <Text
                    variant="bodySm"
                    fontWeight={isReached ? "semibold" : "medium"}
                    color={isReached ? "success" : "subdued"}
                  >
                    {tier.label}
                  </Text>
                </InlineStack>
              </Box>

              {index < tiers.length - 1 && <Icon type="arrow-right" tone="neutral" />}
            </React.Fragment>
          );
        })}
      </InlineStack>
    </BlockStack>
  );
}
