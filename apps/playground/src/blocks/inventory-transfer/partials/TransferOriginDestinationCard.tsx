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
import type { TransferLocationType } from "../types";

type TransferOriginDestinationCardPropsType = {
  locations: TransferLocationType[];
  originLocationId: string;
  destinationLocationId: string;
  referenceNumber: string;
  notes: string;
  onOriginChange: (id: string) => void;
  onDestinationChange: (id: string) => void;
  onReferenceChange: (ref: string) => void;
  onNotesChange: (notes: string) => void;
};

export function TransferOriginDestinationCard({
  locations,
  originLocationId,
  destinationLocationId,
  referenceNumber,
  notes,
  onOriginChange,
  onDestinationChange,
  onReferenceChange,
  onNotesChange,
}: TransferOriginDestinationCardPropsType) {
  const originLoc = locations.find((l) => l.id === originLocationId);
  const destLoc = locations.find((l) => l.id === destinationLocationId);

  const locationOptions = locations.map((loc) => ({
    label: `${loc.name} (${loc.code})`,
    value: loc.id,
  }));

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Locations & Routing
            </Text>
            <Text color="subdued" variant="bodySm">
              Define the source warehouse and destination store for this inventory relocation.
            </Text>
          </BlockStack>
          <Badge tone="info">Inter-Facility Transfer</Badge>
        </InlineStack>

        <Divider />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--p-space-300, 12px)",
          }}
        >
          <BlockStack gap="small-300">
            <Select
              label="Source Location (Origin)"
              options={locationOptions}
              value={originLocationId}
              onChange={(val) => onOriginChange(val)}
            />
            {originLoc && (
              <Box
                padding="small-200"
                background="subdued"
                borderRadius="base"
              >
                <BlockStack gap="small-500">
                  <Text variant="bodySm" fontWeight="medium">
                    {originLoc.address}
                  </Text>
                  <Text variant="bodySm" color="subdued">
                    Total on-hand: {originLoc.availableUnits.toLocaleString()} units
                  </Text>
                </BlockStack>
              </Box>
            )}
          </BlockStack>

          <BlockStack gap="small-300">
            <Select
              label="Destination Location"
              options={locationOptions.filter((opt) => opt.value !== originLocationId)}
              value={destinationLocationId}
              onChange={(val) => onDestinationChange(val)}
            />
            {destLoc && (
              <Box
                padding="small-200"
                background="subdued"
                borderRadius="base"
              >
                <BlockStack gap="small-500">
                  <Text variant="bodySm" fontWeight="medium">
                    {destLoc.address}
                  </Text>
                  <Text variant="bodySm" color="subdued">
                    Total on-hand: {destLoc.availableUnits.toLocaleString()} units
                  </Text>
                </BlockStack>
              </Box>
            )}
          </BlockStack>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "var(--p-space-300, 12px)",
          }}
        >
          <TextField
            label="Transfer Ref / PO #"
            value={referenceNumber}
            onChange={(val) => onReferenceChange(val)}
            placeholder="e.g. TR-2026-0891"
          />
          <TextField
            label="Internal Notes"
            value={notes}
            onChange={(val) => onNotesChange(val)}
            placeholder="e.g. Replenishing Q4 seasonal showroom stock before promotional launch."
          />
        </div>
      </BlockStack>
    </Card>
  );
}
