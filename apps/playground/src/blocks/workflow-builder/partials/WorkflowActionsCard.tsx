import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Select,
  TextField,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import { ACTION_TYPE_OPTIONS } from "../constants";
import type { WorkflowActionType } from "../types";

type WorkflowActionsCardPropsType = {
  actions: WorkflowActionType[];
  onUpdateAction: (id: string, updates: Partial<WorkflowActionType>) => void;
  onAddAction: () => void;
  onRemoveAction: (id: string) => void;
};

export function WorkflowActionsCard({
  actions,
  onUpdateAction,
  onAddAction,
  onRemoveAction,
}: WorkflowActionsCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <InlineStack gap="small-200" alignItems="center">
              <Badge tone="info">Step 3</Badge>
              <Text as="h3" fontWeight="semibold">
                Actions: Then perform these steps
              </Text>
            </InlineStack>
            <Text color="subdued" variant="bodySm">
              Sequential operations executed automatically when conditions pass.
            </Text>
          </BlockStack>
          <Badge tone="success">{actions.length} Actions in Sequence</Badge>
        </InlineStack>

        <Divider />

        <BlockStack gap="small-200">
          {actions.map((act, index) => (
            <Box
              key={act.id}
              padding="small"
              background="base"
              borderRadius="base"
              borderWidth="small-100"
              borderColor="subdued"
              borderStyle="solid"
            >
              <InlineStack gap="base" alignItems="center" justifyContent="space-between">
                <Box inlineSize="70px">
                  <Badge tone="info">THEN {index + 1}</Badge>
                </Box>

                <div style={{ flex: 1 }}>
                  <Select
                    label="Action Type"
                    value={act.actionKey}
                    options={ACTION_TYPE_OPTIONS}
                    onChange={(val) => {
                      const found = ACTION_TYPE_OPTIONS.find((o) => o.value === val);
                      onUpdateAction(act.id, {
                        actionKey: val as WorkflowActionType["actionKey"],
                        actionLabel: found?.label ?? val,
                      });
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Parameter / Target Value"
                    value={act.targetValue}
                    onChange={(val) => onUpdateAction(act.id, { targetValue: val })}
                    placeholder="e.g. VIP-Gold or #channel-name"
                  />
                </div>

                <Button
                  variant="plain"
                  tone="critical"
                  icon="delete"
                  disabled={actions.length <= 1}
                  onClick={() => onRemoveAction(act.id)}
                >
                  Remove
                </Button>
              </InlineStack>
            </Box>
          ))}

          <InlineStack justifyContent="flex-start">
            <Button variant="secondary" icon="plus" onClick={onAddAction}>
              Add Automated Action Step
            </Button>
          </InlineStack>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
