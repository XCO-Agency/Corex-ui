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
import {
  CONDITION_FIELD_OPTIONS,
  CONDITION_OPERATOR_OPTIONS,
} from "../constants";
import type {
  WorkflowConditionItemType,
  WorkflowConditionOperatorType,
} from "../types";

type WorkflowConditionsCardPropsType = {
  logicGate: "AND" | "OR";
  conditions: WorkflowConditionItemType[];
  onUpdateLogicGate: (gate: "AND" | "OR") => void;
  onUpdateCondition: (
    id: string,
    updates: Partial<WorkflowConditionItemType>,
  ) => void;
  onAddCondition: () => void;
  onRemoveCondition: (id: string) => void;
};

export function WorkflowConditionsCard({
  logicGate,
  conditions,
  onUpdateLogicGate,
  onUpdateCondition,
  onAddCondition,
  onRemoveCondition,
}: WorkflowConditionsCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <InlineStack gap="small-200" alignItems="center">
              <Badge tone="info">Step 2</Badge>
              <Text as="h3" fontWeight="semibold">
                Conditions: Check if these rules match
              </Text>
            </InlineStack>
            <Text color="subdued" variant="bodySm">
              Only execute subsequent actions if incoming trigger matches this criteria.
            </Text>
          </BlockStack>

          <InlineStack gap="small-200" alignItems="center">
            <Text variant="bodySm" color="subdued">
              Match:
            </Text>
            <Button
              variant={logicGate === "AND" ? "primary" : "secondary"}
              onClick={() => onUpdateLogicGate("AND")}
            >
              ALL (AND)
            </Button>
            <Button
              variant={logicGate === "OR" ? "primary" : "secondary"}
              onClick={() => onUpdateLogicGate("OR")}
            >
              ANY (OR)
            </Button>
          </InlineStack>
        </InlineStack>

        <Divider />

        <BlockStack gap="small-200">
          {conditions.map((cond, idx) => (
            <Box
              key={cond.id}
              padding="small"
              background="base"
              borderRadius="base"
              borderWidth="small-100"
              borderColor="subdued"
              borderStyle="solid"
            >
              <InlineStack gap="base" alignItems="center" justifyContent="space-between">
                <Box inlineSize="60px">
                  <Badge tone="neutral">
                    {idx === 0 ? "IF" : logicGate}
                  </Badge>
                </Box>

                <div style={{ flex: 1 }}>
                  <Select
                    label="Field Property"
                    value={cond.field}
                    options={CONDITION_FIELD_OPTIONS}
                    onChange={(val) => onUpdateCondition(cond.id, { field: val })}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <Select
                    label="Operator"
                    value={cond.operator}
                    options={CONDITION_OPERATOR_OPTIONS}
                    onChange={(val) =>
                      onUpdateCondition(cond.id, {
                        operator: val as WorkflowConditionOperatorType,
                      })
                    }
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Value"
                    value={cond.value}
                    onChange={(val) => onUpdateCondition(cond.id, { value: val })}
                  />
                </div>

                <Button
                  variant="plain"
                  tone="critical"
                  icon="delete"
                  disabled={conditions.length <= 1}
                  onClick={() => onRemoveCondition(cond.id)}
                >
                  Remove
                </Button>
              </InlineStack>
            </Box>
          ))}

          <InlineStack justifyContent="flex-start">
            <Button variant="secondary" icon="plus" onClick={onAddCondition}>
              Add Rule Condition
            </Button>
          </InlineStack>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
