import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Select,
  TextField,
  Box,
} from "@xco-agency/corex-ui";
import { WORKFLOW_TRIGGER_OPTIONS } from "../constants";
import type { WorkflowTriggerEventType } from "../types";

type WorkflowTriggerCardPropsType = {
  name: string;
  description: string;
  triggerEvent: WorkflowTriggerEventType;
  onUpdateName: (name: string) => void;
  onUpdateDescription: (description: string) => void;
  onUpdateTrigger: (trigger: WorkflowTriggerEventType) => void;
};

export function WorkflowTriggerCard({
  name,
  description,
  triggerEvent,
  onUpdateName,
  onUpdateDescription,
  onUpdateTrigger,
}: WorkflowTriggerCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <InlineStack gap="small-200" alignItems="center">
              <Badge tone="info">Step 1</Badge>
              <Text as="h3" fontWeight="semibold">
                Trigger: When this happens
              </Text>
            </InlineStack>
            <Text color="subdued" variant="bodySm">
              Define the initiating event in Shopify that fires this automation.
            </Text>
          </BlockStack>
        </InlineStack>

        <TextField
          label="Workflow Name"
          value={name}
          onChange={onUpdateName}
          placeholder="e.g. Auto-Tag High-Value VIP Orders"
        />

        <TextField
          label="Description (Optional)"
          value={description}
          onChange={onUpdateDescription}
          placeholder="Summary of what this automation accomplishes"
        />

        <Box
          padding="base"
          background="subdued"
          borderRadius="base"
          borderWidth="small-100"
          borderColor="subdued"
          borderStyle="solid"
        >
          <BlockStack gap="small-200">
            <Select
              label="Select Shopify Trigger Event"
              value={triggerEvent}
              options={WORKFLOW_TRIGGER_OPTIONS}
              onChange={(val) => onUpdateTrigger(val as WorkflowTriggerEventType)}
            />
            <Text color="subdued" variant="bodySm">
              Payload includes line items, customer address, tags, and gateway details.
            </Text>
          </BlockStack>
        </Box>
      </BlockStack>
    </Card>
  );
}
