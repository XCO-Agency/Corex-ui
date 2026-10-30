import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Card,
  Grid,
  InlineStack,
  Selectable,
  Text,
} from "@xco-agency/corex-ui";
import type { SelectableToneType } from "@xco-agency/corex-ui";

const plans = [
  { value: "starter", name: "Starter", price: "$29 / month", note: "500 orders" },
  { value: "growth", name: "Growth", price: "$79 / month", note: "2,500 orders" },
  { value: "scale", name: "Scale", price: "$199 / month", note: "Unlimited orders" },
];

const tones: SelectableToneType[] = ["info", "success", "warning", "critical", "neutral"];

export function SelectableExample() {
  const [plan, setPlan] = useState<string[]>(["growth"]);
  const [channels, setChannels] = useState<string[]>(["online-store"]);
  const [media, setMedia] = useState<string[]>(["daily_olive"]);
  const [singleMedia, setSingleMedia] = useState<string[]>(["studio_shot"]);

  return (
    <BlockStack gap="large-100">
      {/* Default corner badge */}
      <BlockStack gap="small-200">
        <Text heading>Choose a plan (default indicator)</Text>
        <Selectable.Group value={plan} onChange={setPlan} accessibilityLabel="Plan">
          <Grid columns={{ xs: 1, md: 3 }} gap="base">
            {plans.map((item) => (
              <Selectable
                key={item.value}
                value={item.value}
                indicator
                shadow
                tone="caution"
                borderRadius="large"
                accessibilityLabel={item.name}
              >
                <Card>
                  <BlockStack gap="small-300">
                    <Text heading>{item.name}</Text>
                    <Text>{item.price}</Text>
                    <Text color="subdued">{item.note}</Text>
                  </BlockStack>
                </Card>
              </Selectable>
            ))}
          </Grid>
        </Selectable.Group>
      </BlockStack>

      {/* Multiple selection with default badge */}
      <BlockStack gap="small-200">
        <Text heading>Multiple select (default indicator)</Text>
        <Selectable.Group
          multiple
          tone="neutral"
          value={channels}
          onChange={setChannels}
          accessibilityLabel="Sales channels"
        >
          <InlineStack gap="base" wrap>
            {[
              { value: "online-store", label: "Online Store" },
              { value: "pos", label: "Point of Sale" },
              { value: "social", label: "Social" },
            ].map((item) => (
              <Selectable
                key={item.value}
                value={item.value}
                inlineSize="auto"
                outlineOffset={2}
                indicator
                interactive
                shadow
                borderRadius="large"
                accessibilityLabel={item.label}
              >
                <Card>
                  <Text>{item.label}</Text>
                </Card>
              </Selectable>
            ))}
          </InlineStack>
        </Selectable.Group>
      </BlockStack>

      {/* Media-style cards with checkbox indicator */}
      <BlockStack gap="small-200">
        <Text heading>Media multi-select (checkbox)</Text>
        <Selectable.Group
          multiple
          tone="neutral"
          value={media}
          onChange={setMedia}
          accessibilityLabel="Media files"
        >
          <InlineStack gap="base" wrap>
            {[
              { value: "daily_olive", label: "daily_olive", meta: "JPG" },
              { value: "studio_shot", label: "studio_shot", meta: "PNG" },
              { value: "packaging", label: "packaging", meta: "JPG" },
            ].map((item) => (
              <Selectable
                key={item.value}
                value={item.value}
                indicator="checkbox"
                tone="neutral"
                borderRadius="large"
                inlineSize="auto"
                accessibilityLabel={item.label}
              >
                <Card>
                  <BlockStack gap="small-100">
                    <BoxPreview />
                    <Text>{item.label}</Text>
                    <Text color="subdued">{item.meta}</Text>
                  </BlockStack>
                </Card>
              </Selectable>
            ))}
          </InlineStack>
        </Selectable.Group>
      </BlockStack>

      {/* Single-select media with radio indicator */}
      <BlockStack gap="small-200">
        <Text heading>Media single-select (radio)</Text>
        <Selectable.Group
          tone="neutral"
          value={singleMedia}
          onChange={setSingleMedia}
          accessibilityLabel="Featured media"
        >
          <InlineStack gap="base" wrap>
            {[
              { value: "daily_olive", label: "daily_olive", meta: "JPG" },
              { value: "studio_shot", label: "studio_shot", meta: "PNG" },
            ].map((item) => (
              <Selectable
                key={item.value}
                value={item.value}
                indicator="radio"
                tone="neutral"
                borderRadius="large"
                inlineSize="auto"
                accessibilityLabel={item.label}
              >
                <Card>
                  <BlockStack gap="small-100">
                    <BoxPreview />
                    <Text>{item.label}</Text>
                    <Text color="subdued">{item.meta}</Text>
                  </BlockStack>
                </Card>
              </Selectable>
            ))}
          </InlineStack>
        </Selectable.Group>
      </BlockStack>

      {/* Every tone, highlight only (no interaction) */}
      <BlockStack gap="small-200">
        <Text heading>Tones</Text>
        <InlineStack gap="base" wrap>
          {tones.map((tone) => (
            <Selectable
              key={tone}
              selected
              interactive={false}
              tone={tone}
              borderRadius="large"
              inlineSize="auto"
            >
              <Card>
                <Badge tone={tone === "neutral" ? "neutral" : tone}>{tone}</Badge>
              </Card>
            </Selectable>
          ))}
        </InlineStack>
      </BlockStack>

      {/* Standalone toggle and a disabled item */}
      <InlineStack gap="base" wrap>
        <Selectable inlineSize="auto" tone="info" borderRadius="large" outlineWidth={3}>
          <Card>
            <Text>Click or press Space to toggle</Text>
          </Card>
        </Selectable>
        <Selectable inlineSize="auto" disabled borderRadius="large" defaultSelected>
          <Card>
            <Text>Disabled</Text>
          </Card>
        </Selectable>
      </InlineStack>
    </BlockStack>
  );
}

/** Compact preview tile so inset indicators read like a media card. */
function BoxPreview() {
  return (
    <Box
      background="subdued"
      borderRadius="base"
      padding="large-200"
      minBlockSize="80px"
    >
      <BlockStack alignItems="center" justifyContent="center">
        <Text color="subdued">Preview</Text>
      </BlockStack>
    </Box>
  );
}
