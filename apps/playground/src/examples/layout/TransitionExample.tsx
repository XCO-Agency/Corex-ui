import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  InlineStack,
  Text,
  Transition,
  type TransitionVariantType,
} from "@xco-agency/corex-ui";

const VARIANTS: { label: string; value: TransitionVariantType }[] = [
  { label: "Fade Up", value: "fade-up" },
  { label: "Fade Down", value: "fade-down" },
  { label: "Fade", value: "fade" },
  { label: "Scale", value: "scale" },
  { label: "Pop", value: "pop" },
  { label: "Zoom", value: "zoom" },
  { label: "Slide Up", value: "slide-up" },
  { label: "Slide Down", value: "slide-down" },
  { label: "Slide Left", value: "slide-left" },
  { label: "Slide Right", value: "slide-right" },
];

export function TransitionExample() {
  const [show, setShow] = useState(true);
  const [variant, setVariant] = useState<TransitionVariantType>("fade-up");
  const [reverse, setReverse] = useState(false);

  return (
    <BlockStack gap="base">
      <Card>
        <BlockStack gap="base">
          <InlineStack justifyContent="space-between" alignItems="center">
            <BlockStack gap="small-400">
              <Text heading as="h4">
                Transition Playground
              </Text>
              <Text as="p" color="subdued">
                Select an animation preset and toggle visibility to test in/out
                transitions.
              </Text>
            </BlockStack>
            <InlineStack gap="small-200">
              <Button
                variant={reverse ? "primary" : "secondary"}
                onClick={() => setReverse((r) => !r)}
              >
                {reverse ? "Reverse: On" : "Reverse: Off"}
              </Button>
              <Button variant="primary" onClick={() => setShow((s) => !s)}>
                {show ? "Hide (Transition Out)" : "Show (Transition In)"}
              </Button>
            </InlineStack>
          </InlineStack>

          <Divider />

          <BlockStack gap="small-200">
            <Text as="p" color="subdued">
              Animation Variant Presets:
            </Text>
            <ButtonGroup>
              {VARIANTS.map((v) => (
                <Button
                  key={v.value}
                  variant={variant === v.value ? "primary" : "secondary"}
                  onClick={() => setVariant(v.value)}
                >
                  {v.label}
                </Button>
              ))}
            </ButtonGroup>
          </BlockStack>
        </BlockStack>
      </Card>

      <Box
        background="bg-surface-secondary"
        borderRadius="base"
        padding="large-200"
        minBlockSize="220px"
      >
        <InlineStack justifyContent="center" alignItems="center">
          <Transition
            onEnter={() => console.log("")}
            animate={variant}
            show={show}
            reverse={reverse}
          >
            <Card>
              <BlockStack gap="small-200" justifyContent="center">
                <Badge tone="info">{`Preset: ${variant}`}</Badge>
                <Text heading as="h3">
                  Automatic In & Out Animation
                </Text>
                <Text as="p" color="subdued">
                  {` Reverse: ${reverse ? "Enabled" : "Disabled"}`}
                </Text>
              </BlockStack>
            </Card>
          </Transition>
        </InlineStack>
      </Box>
    </BlockStack>
  );
}
