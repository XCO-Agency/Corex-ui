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
  SEGMENT_CRITERION_OPTIONS,
  SEGMENT_OPERATOR_OPTIONS,
} from "../constants";
import type { SegmentFilterRuleType, SegmentOperatorType } from "../types";

type SegmentFilterBuilderCardPropsType = {
  name: string;
  description: string;
  rules: SegmentFilterRuleType[];
  onUpdateName: (name: string) => void;
  onUpdateDescription: (description: string) => void;
  onUpdateRule: (id: string, updates: Partial<SegmentFilterRuleType>) => void;
  onAddRule: () => void;
  onRemoveRule: (id: string) => void;
};

export function SegmentFilterBuilderCard({
  name,
  description,
  rules,
  onUpdateName,
  onUpdateDescription,
  onUpdateRule,
  onAddRule,
  onRemoveRule,
}: SegmentFilterBuilderCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Audience Filter Rules
            </Text>
            <Text color="subdued" variant="small">
              Configure filtering criteria to define customer segment membership dynamically.
            </Text>
          </BlockStack>
          <Badge tone="info">{rules.length} Active Rules</Badge>
        </InlineStack>

        <Divider />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--p-space-300, 12px)",
          }}
        >
          <TextField
            label="Segment Name"
            value={name}
            onChange={(val) => onUpdateName(val)}
            placeholder="e.g. VIP Repeat Spenders"
          />
          <TextField
            label="Segment Description"
            value={description}
            onChange={(val) => onUpdateDescription(val)}
            placeholder="e.g. Customers with 3+ purchases and >$200 spend"
          />
        </div>

        <Divider />

        <BlockStack gap="small-300">
          <Text fontWeight="semibold" variant="small">
            Segment Query Rules
          </Text>

          {rules.map((rule, index) => (
            <Box
              key={rule.id}
              padding="small"
              background="base"
              borderRadius="base"
              borderWidth="small-100"
              borderColor="subdued"
              borderStyle="solid"
            >
              <InlineStack gap="base" alignItems="center">
                <Box inlineSize="60px">
                  <Badge tone="neutral">
                    {index === 0 ? "WHERE" : "AND"}
                  </Badge>
                </Box>

                <div style={{ width: "160px" }}>
                  <Select
                    label="Property"
                    value={rule.criterion}
                    options={SEGMENT_CRITERION_OPTIONS}
                    onChange={(val) =>
                      onUpdateRule(rule.id, {
                        criterion: val as SegmentFilterRuleType["criterion"],
                      })
                    }
                  />
                </div>

                <div style={{ width: "150px" }}>
                  <Select
                    label="Condition"
                    value={rule.operator}
                    options={SEGMENT_OPERATOR_OPTIONS}
                    onChange={(val) =>
                      onUpdateRule(rule.id, {
                        operator: val as SegmentOperatorType,
                      })
                    }
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Value"
                    value={rule.value}
                    onChange={(val) => onUpdateRule(rule.id, { value: val })}
                  />
                </div>

                <Button
                  variant="tertiary"
                  tone="critical"
                  icon="delete"
                  disabled={rules.length <= 1}
                  onClick={() => onRemoveRule(rule.id)}
                >
                  Remove
                </Button>
              </InlineStack>
            </Box>
          ))}

          <InlineStack justifyContent="flex-start">
            <Button variant="secondary" icon="plus" onClick={onAddRule}>
              Add Rule Condition
            </Button>
          </InlineStack>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
