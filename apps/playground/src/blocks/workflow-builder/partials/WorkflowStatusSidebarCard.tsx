import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Divider,
  Box,
} from "@xco-agency/corex-ui";

type WorkflowStatusSidebarCardPropsType = {
  enabled: boolean;
  totalRuns: number;
  lastRunAt: string;
  conditionCount: number;
  actionCount: number;
  onToggleEnabled: (enabled: boolean) => void;
  onSimulateRun: () => void;
};

export function WorkflowStatusSidebarCard({
  enabled,
  totalRuns,
  lastRunAt,
  conditionCount,
  actionCount,
  onToggleEnabled,
  onSimulateRun,
}: WorkflowStatusSidebarCardPropsType) {
  return (
    <BlockStack gap="base">
      <Card>
        <BlockStack gap="base">
          <Text as="h3" fontWeight="semibold">
            Automation Status
          </Text>

          <InlineStack justifyContent="space-between" alignItems="center">
            <Text color="subdued" variant="bodySm">
              State
            </Text>
            <Badge tone={enabled ? "success" : "neutral"}>
              {enabled ? "Active & Listening" : "Paused"}
            </Badge>
          </InlineStack>

          <Button
            variant={enabled ? "secondary" : "primary"}
            onClick={() => onToggleEnabled(!enabled)}
          >
            {enabled ? "Pause Automation" : "Turn On Automation"}
          </Button>

          <Divider />

          <BlockStack gap="small-200">
            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Conditions
              </Text>
              <Text fontWeight="semibold" variant="bodySm">
                {conditionCount} checks
              </Text>
            </InlineStack>

            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Actions
              </Text>
              <Text fontWeight="semibold" variant="bodySm">
                {actionCount} steps
              </Text>
            </InlineStack>

            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Lifetime Executions
              </Text>
              <Text fontWeight="semibold" variant="bodySm">
                {totalRuns.toLocaleString()} runs
              </Text>
            </InlineStack>

            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Last Triggered
              </Text>
              <Text fontWeight="semibold" variant="bodySm">
                {lastRunAt}
              </Text>
            </InlineStack>
          </BlockStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="small">
          <Text as="h3" fontWeight="semibold">
            Test & Dry Run
          </Text>
          <Text color="subdued" variant="bodySm">
            Send a sample mock payload to verify conditions without mutating live store data.
          </Text>
          <Box padding="small" background="subdued" borderRadius="base">
            <InlineStack justifyContent="space-between" alignItems="center">
              <Text variant="bodySm" fontWeight="semibold">
                Mock Order: #1089 ($185.00)
              </Text>
              <Badge tone="success">Passes</Badge>
            </InlineStack>
          </Box>
          <Button variant="secondary" onClick={onSimulateRun}>
            Run Test Simulation
          </Button>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
