import * as React from "react";
import { Box, InlineStack, Text, Icon } from "@xco-agency/corex-ui";
import type { DiscountTierType } from "../types";

export type AppCrossSellTierProgressPropsType = {
  tiers: DiscountTierType[];
  installedCount?: number;
};

export function AppCrossSellTierProgress({
  tiers,
  installedCount = 1,
}: AppCrossSellTierProgressPropsType) {
  return (
    <InlineStack justifyContent="space-between" alignItems="center" gap="small-200" wrap>
      {tiers.map((tier, index) => {
        const isReached = installedCount >= tier.appsCount;

        return (
          <React.Fragment key={tier.id}>
            <Box
              background={isReached ? "bg-surface-secondary" : "bg-surface"}
              borderWidth="small-100"
              borderColor={isReached ? "border" : "border-subdued"}
              borderRadius="large-100"
              padding="small-200 base"
            >
              <Text
                variant="bodySm"
                fontWeight={isReached ? "semibold" : "medium"}
                tone={isReached ? "success" : "subdued"}
              >
                {tier.label}
              </Text>
            </Box>

            {index < tiers.length - 1 && (
              <Icon type="arrow-right" tone="subdued" />
            )}
          </React.Fragment>
        );
      })}
    </InlineStack>
  );
}
