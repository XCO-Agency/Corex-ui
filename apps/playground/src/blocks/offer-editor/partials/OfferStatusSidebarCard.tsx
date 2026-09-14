import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Switch,
  TextField,
  Divider,
} from "@xco-agency/corex-ui";
import type { OfferStatusSidebarCardPropsType } from "../types";

export function OfferStatusSidebarCard({
  isActive,
  startDate,
  endDate,
  hasEndDate,
  onIsActiveChange,
  onStartDateChange,
  onEndDateChange,
  onHasEndDateChange,
}: OfferStatusSidebarCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        {/* Status Header */}
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="small-200"
        >
          <Text variant="base" heading>
            Campaign status
          </Text>
          <Badge tone={isActive ? "success" : "neutral"}>
            {isActive ? "Active" : "Draft"}
          </Badge>
        </InlineStack>

        <InlineStack justifyContent="space-between" alignItems="center">
          <Text variant="small">Enable in cart</Text>
          <Switch
            label="Enable in cart"
            checked={isActive}
            onChange={(checked) => onIsActiveChange(checked)}
          />
        </InlineStack>

        <Divider />

        {/* Schedule */}
        <BlockStack gap="small-300">
          <Text variant="base" heading>
            Schedule & runtime
          </Text>

          <TextField
            label="Start date"
            type="date"
            value={startDate}
            onChange={onStartDateChange}
          />

          <InlineStack justifyContent="space-between" alignItems="center">
            <Text variant="small">Set end date</Text>
            <Switch
              label="Set end date"
              checked={hasEndDate}
              onChange={(checked) => onHasEndDateChange(checked)}
            />
          </InlineStack>

          {hasEndDate && (
            <TextField
              label="End date"
              type="date"
              value={endDate}
              onChange={onEndDateChange}
            />
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
