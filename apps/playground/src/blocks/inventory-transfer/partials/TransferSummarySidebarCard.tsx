import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import type { TransferItemType, TransferLocationType, TransferStatusType } from "../types";

type TransferSummarySidebarCardPropsType = {
  originLocation?: TransferLocationType;
  destinationLocation?: TransferLocationType;
  items: TransferItemType[];
  status: TransferStatusType;
  onInitiateTransfer: () => void;
  onPrintManifest: () => void;
  isProcessing?: boolean;
};

export function TransferSummarySidebarCard({
  originLocation,
  destinationLocation,
  items,
  status,
  onInitiateTransfer,
  onPrintManifest,
  isProcessing = false,
}: TransferSummarySidebarCardPropsType) {
  const totalUnits = items.reduce((acc, it) => acc + it.transferQuantity, 0);
  const totalValuation = items.reduce(
    (acc, it) => acc + it.transferQuantity * it.unitCost,
    0,
  );
  const hasExceeded = items.some((it) => it.transferQuantity > it.originStock);

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <Text as="h3" fontWeight="semibold">
            Transfer Summary
          </Text>
          <Badge tone={status === "draft" ? "info" : "success"}>
            {status === "draft" ? "Draft Stage" : "Dispatched"}
          </Badge>
        </InlineStack>

        <Divider />

        <BlockStack gap="small-300">
          <InlineStack justifyContent="space-between" alignItems="center">
            <Text color="subdued" variant="bodySm">
              Route
            </Text>
            <Text fontWeight="semibold" variant="bodySm">
              {originLocation?.code || "—"} → {destinationLocation?.code || "—"}
            </Text>
          </InlineStack>

          <InlineStack justifyContent="space-between" alignItems="center">
            <Text color="subdued" variant="bodySm">
              Unique SKUs
            </Text>
            <Text fontWeight="semibold" variant="bodySm">
              {items.length} products
            </Text>
          </InlineStack>

          <InlineStack justifyContent="space-between" alignItems="center">
            <Text color="subdued" variant="bodySm">
              Total Units
            </Text>
            <Text fontWeight="semibold" variant="bodySm">
              {totalUnits} units
            </Text>
          </InlineStack>

          <InlineStack justifyContent="space-between" alignItems="center">
            <Text color="subdued" variant="bodySm">
              Declared Value
            </Text>
            <Text fontWeight="bold" variant="bodySm">
              ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </InlineStack>
        </BlockStack>

        <Divider />

        {hasExceeded ? (
          <Box
            padding="small-200"
            background="subdued"
            borderRadius="base"
            borderWidth="small-100"
            borderColor="critical"
            borderStyle="solid"
          >
            <Text variant="bodySm" tone="critical">
              Cannot dispatch transfer: One or more SKU quantities exceed available origin stock.
            </Text>
          </Box>
        ) : (
          <Box
            padding="small-200"
            background="subdued"
            borderRadius="base"
          >
            <Text variant="bodySm" color="subdued">
              Stock will be moved to &quot;Reserved for Transit&quot; upon order initiation.
            </Text>
          </Box>
        )}

        <BlockStack gap="small-200">
          <Button
            variant="primary"
            onClick={onInitiateTransfer}
            disabled={hasExceeded || items.length === 0 || isProcessing}
          >
            {isProcessing ? "Processing Transfer..." : "Initiate Stock Transfer"}
          </Button>

          <Button variant="secondary" onClick={onPrintManifest}>
            Print Shipping Manifest
          </Button>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
