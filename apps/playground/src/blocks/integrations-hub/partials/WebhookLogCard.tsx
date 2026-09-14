import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Table,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import type { WebhookLogCardPropsType } from "../types";

export function WebhookLogCard({ logs, onRefresh }: WebhookLogCardPropsType) {
  return (
    <Card padding="none">
      <div style={{ padding: "16px" }}>
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="small-200"
        >
          <BlockStack gap="none">
            <Text variant="base" heading>
              Recent webhook events & delivery log
            </Text>
            <Text variant="small" tone="neutral">
              Live payload delivery status to external connected systems.
            </Text>
          </BlockStack>

          <Button variant="secondary" onClick={onRefresh}>
            Refresh log
          </Button>
        </InlineStack>
      </div>

      <Table variant="auto">
        <Table.HeaderRow>
          <Table.Header listSlot="primary">Event Topic</Table.Header>
          <Table.Header listSlot="inline">Status</Table.Header>
          <Table.Header format="numeric">Response Code</Table.Header>
          <Table.Header format="numeric">Duration</Table.Header>
          <Table.Header>Timestamp</Table.Header>
        </Table.HeaderRow>

        <Table.Body>
          {logs.map((log) => (
            <Table.Row key={log.id}>
              <Table.Cell>
                <Text variant="small" heading>
                  {log.topic}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <Badge tone={log.status === "success" ? "success" : "critical"}>
                  {log.status === "success" ? "Delivered" : "Failed"}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Text variant="small">{log.statusCode}</Text>
              </Table.Cell>

              <Table.Cell>
                <Text variant="small">{log.durationMs} ms</Text>
              </Table.Cell>

              <Table.Cell>
                <Text variant="xs" tone="neutral">
                  {log.timestamp}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
