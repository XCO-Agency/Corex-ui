import * as React from "react";
import { Box, BlockStack, InlineStack, Text, Badge, Button } from "@xco-agency/corex-ui";
import type { AppCrossSellItemType } from "../types";
import { AppIconBadge } from "./AppIconBadge";

export type AppCrossSellRowPropsType = {
  app: AppCrossSellItemType;
  onInstall?: (id: string) => void;
  isLast?: boolean;
};

export function AppCrossSellRow({
  app,
  onInstall,
  isLast = false,
}: AppCrossSellRowPropsType) {
  return (
    <Box
      padding="small-200 base"
      borderBlockEndWidth={isLast ? "none" : "small-100"}
      borderColor="border-subdued"
    >
      <InlineStack justifyContent="space-between" alignItems="center" gap="base">
        {/* App identity */}
        <InlineStack gap="base" alignItems="center">
          <AppIconBadge
            type={app.iconType}
            bg={app.iconBg}
            logoUrl={app.logoUrl}
            name={app.name}
            size={38}
          />
          <BlockStack gap="small-500">
            <InlineStack gap="small-200" alignItems="center" wrap>
              <Text variant="base" fontWeight="semibold">
                {app.name}
              </Text>
              {app.builtForShopify && (
                <Badge tone="info" size="small">
                  Built for Shopify
                </Badge>
              )}
            </InlineStack>
            {app.category && (
              <Text variant="xs" tone="subdued">
                {app.category}
              </Text>
            )}
          </BlockStack>
        </InlineStack>

        {/* Action / Status */}
        <InlineStack shrink={false}>
          {app.installed ? (
            <Badge tone="success" size="base">
              Installed
            </Badge>
          ) : (
            <Button
              variant="secondary"
              onClick={() => onInstall?.(app.id)}
            >
              {app.unlockDiscountText || "Install to unlock 30% off"}
            </Button>
          )}
        </InlineStack>
      </InlineStack>
    </Box>
  );
}
