import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Select,
  TextField,
  Badge,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import { MOCK_CARRIERS, MOCK_SHIPPING_METHODS } from "../constants";
import type { TransferShippingType } from "../types";

type TransferShipmentDetailsCardPropsType = {
  shipping: TransferShippingType;
  onChangeShipping: <K extends keyof TransferShippingType>(
    field: K,
    val: TransferShippingType[K],
  ) => void;
};

export function TransferShipmentDetailsCard({
  shipping,
  onChangeShipping,
}: TransferShipmentDetailsCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Logistics & Carrier Details
            </Text>
            <Text color="subdued" variant="bodySm">
              Configure courier dispatch, tracking identification, and estimated delivery dates.
            </Text>
          </BlockStack>
          <Badge tone="neutral">Freight Manifest</Badge>
        </InlineStack>

        <Divider />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--p-space-300, 12px)",
          }}
        >
          <Select
            label="Shipping Carrier"
            options={MOCK_CARRIERS}
            value={shipping.carrier}
            onChange={(val) => onChangeShipping("carrier", val)}
          />

          <Select
            label="Delivery Service Level"
            options={MOCK_SHIPPING_METHODS}
            value={shipping.shippingMethod}
            onChange={(val) => onChangeShipping("shippingMethod", val)}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--p-space-300, 12px)",
          }}
        >
          <TextField
            label="Tracking or BOL #"
            value={shipping.trackingNumber}
            onChange={(val) => onChangeShipping("trackingNumber", val)}
            placeholder="e.g. 7946 2948 1092"
          />

          <TextField
            label="Expected Delivery Date"
            value={shipping.expectedDeliveryDate}
            onChange={(val) => onChangeShipping("expectedDeliveryDate", val)}
            placeholder="YYYY-MM-DD (e.g. 2026-09-22)"
          />
        </div>

        <Box
          padding="small-200"
          background="subdued"
          borderRadius="base"
        >
          <InlineStack justifyContent="space-between" alignItems="center">
            <BlockStack gap="small-500">
              <Text fontWeight="semibold" variant="bodySm">
                Estimated Transit Duration
              </Text>
              <Text color="subdued" variant="bodySm">
                Calculated transit time: ~3 Business Days via Ground Freight.
              </Text>
            </BlockStack>
            <Badge tone="success">In-Transit SLA Covered</Badge>
          </InlineStack>
        </Box>
      </BlockStack>
    </Card>
  );
}
