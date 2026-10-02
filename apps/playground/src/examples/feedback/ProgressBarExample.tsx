import { useState } from "react";
import {
  ProgressBar,
  BlockStack,
  InlineStack,
  Card,
  Text,
  Button,
  ButtonGroup,
} from "@xco-agency/corex-ui";

export function ProgressBarExample() {
  const [value, setValue] = useState(65);
  const max = 100;

  return (
    <BlockStack gap="large-200">
      <Card>
        <BlockStack gap="base">
          <InlineStack justifyContent="space-between" alignItems="center">
            <Text heading as="h3">
              Interactive Determinate Progress
            </Text>
            <ButtonGroup>
              <Button onClick={() => setValue((v) => Math.max(0, v - 10))}>
                -10
              </Button>
              <Button onClick={() => setValue((v) => Math.min(max, v + 10))}>
                +10
              </Button>
            </ButtonGroup>
          </InlineStack>

          <ProgressBar
            accessibilityLabel="Task completion"
            value={value}
            max={max}
            tone="success"
          />
          <Text tone="neutral">
            Current progress: {value} of {max} ({Math.round((value / max) * 100)}%)
          </Text>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="large-100">
          <Text heading as="h3">
            Indeterminate Progress
          </Text>
          <Text tone="neutral">
            Omit value when work is ongoing and you cannot measure how much is left.
          </Text>
          <ProgressBar accessibilityLabel="Importing products" />
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="large-100">
          <Text heading as="h3">
            Tones
          </Text>

          <BlockStack gap="base">
            <BlockStack gap="small-200">
              <InlineStack justifyContent="space-between">
                <Text>Auto (Default)</Text>
                <Text tone="neutral">50%</Text>
              </InlineStack>
              <ProgressBar accessibilityLabel="Auto tone progress" value={50} max={100} tone="auto" />
            </BlockStack>

            <BlockStack gap="small-200">
              <InlineStack justifyContent="space-between">
                <Text>Info</Text>
                <Text tone="neutral">30 of 100</Text>
              </InlineStack>
              <ProgressBar accessibilityLabel="Inventory synced" value={30} max={100} tone="info" />
            </BlockStack>

            <BlockStack gap="small-200">
              <InlineStack justifyContent="space-between">
                <Text>Success</Text>
                <Text tone="neutral">100 of 100</Text>
              </InlineStack>
              <ProgressBar accessibilityLabel="Task complete" value={100} max={100} tone="success" />
            </BlockStack>

            <BlockStack gap="small-200">
              <InlineStack justifyContent="space-between">
                <Text>Neutral</Text>
                <Text tone="neutral">60 of 100</Text>
              </InlineStack>
              <ProgressBar accessibilityLabel="General status" value={60} max={100} tone="neutral" />
            </BlockStack>

            <BlockStack gap="small-200">
              <InlineStack justifyContent="space-between">
                <Text>Caution</Text>
                <Text tone="neutral">72 of 100</Text>
              </InlineStack>
              <ProgressBar accessibilityLabel="Storage used" value={72} max={100} tone="caution" />
            </BlockStack>

            <BlockStack gap="small-200">
              <InlineStack justifyContent="space-between">
                <Text>Warning</Text>
                <Text tone="neutral">85 of 100</Text>
              </InlineStack>
              <ProgressBar accessibilityLabel="Quota threshold reached" value={85} max={100} tone="warning" />
            </BlockStack>

            <BlockStack gap="small-200">
              <InlineStack justifyContent="space-between">
                <Text>Critical</Text>
                <Text tone="neutral">96 of 100</Text>
              </InlineStack>
              <ProgressBar accessibilityLabel="API rate limit used" value={96} max={100} tone="critical" />
            </BlockStack>
          </BlockStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

export default ProgressBarExample;
