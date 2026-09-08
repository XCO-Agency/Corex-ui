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
  const [progress, setProgress] = useState(65);

  return (
    <BlockStack gap="large-200">
      <Card>
        <BlockStack gap="base">
          <InlineStack justifyContent="space-between" alignItems="center">
            <Text heading as="h3">
              Interactive Progress
            </Text>
            <ButtonGroup>
              <Button size="slim" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
                -10%
              </Button>
              <Button
                size="slim"
                onClick={() => setProgress((p) => Math.min(100, p + 10))}
              >
                +10%
              </Button>
            </ButtonGroup>
          </InlineStack>

          <ProgressBar progress={progress} tone="success" size="base" />
          <Text color="subdued">Current progress: {progress}%</Text>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="large-100">
          <Text heading as="h3">
            Tones
          </Text>

          <BlockStack gap="small-200">
            <Text color="subdued">Success (Default)</Text>
            <ProgressBar progress={80} tone="success" />
          </BlockStack>

          <BlockStack gap="small-200">
            <Text color="subdued">Neutral</Text>
            <ProgressBar progress={60} tone="neutral" />
          </BlockStack>

          <BlockStack gap="small-200">
            <Text color="subdued">Caution</Text>
            <ProgressBar progress={45} tone="caution" />
          </BlockStack>

          <BlockStack gap="small-200">
            <Text color="subdued">Critical</Text>
            <ProgressBar progress={20} tone="critical" />
          </BlockStack>

          <BlockStack gap="small-200">
            <Text color="subdued">Subdued</Text>
            <ProgressBar progress={35} color="subdued" />
          </BlockStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="large-100">
          <Text heading as="h3">
            Sizes
          </Text>

          <BlockStack gap="small-200">
            <Text color="subdued">Extra Small (xs - 4px)</Text>
            <ProgressBar progress={50} size="xs" />
          </BlockStack>

          <BlockStack gap="small-200">
            <Text color="subdued">Small (sm - 5px)</Text>
            <ProgressBar progress={50} size="sm" />
          </BlockStack>

          <BlockStack gap="small-200">
            <Text color="subdued">Base (base - 6px)</Text>
            <ProgressBar progress={50} size="base" />
          </BlockStack>

          <BlockStack gap="small-200">
            <Text color="subdued">Large (lg - 8px)</Text>
            <ProgressBar progress={50} size="lg" />
          </BlockStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

export default ProgressBarExample;
