import { useState } from "react";
import { BlockStack, Box, Grid, InlineStack, ColorField, Text } from "@xco-agency/corex-ui";

export function ColorFieldExample() {
  const [brandColor, setBrandColor] = useState("#008060");
  const [accentColor, setAccentColor] = useState("#5c6ac4");

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <BlockStack gap="base">
          <ColorField
            label="Brand primary color"
            value={brandColor}
            details="Used for primary buttons, banners, and links"
            onChange={(val) => setBrandColor(val)}
          />
          <InlineStack gap="small-200" align="center">
            <Box
              style={{
                width: 20,
                height: 20,
                borderRadius: "var(--p-border-radius-100, 4px)",
                backgroundColor: brandColor,
                border: "1px solid var(--p-color-border, #d4d4d4)",
              }}
            />
            <Text variant="small" tone="subdued">{brandColor}</Text>
          </InlineStack>
        </BlockStack>
      </Grid.Item>

      <Grid.Item>
        <BlockStack gap="base">
          <ColorField
            label="Accent color (with alpha)"
            value={accentColor}
            alpha
            details="Supports opacity and transparency controls"
            onChange={(val) => setAccentColor(val)}
          />
          <InlineStack gap="small-200" align="center">
            <Box
              style={{
                width: 20,
                height: 20,
                borderRadius: "var(--p-border-radius-100, 4px)",
                backgroundColor: accentColor,
                border: "1px solid var(--p-color-border, #d4d4d4)",
              }}
            />
            <Text variant="small" tone="subdued">{accentColor}</Text>
          </InlineStack>
        </BlockStack>
      </Grid.Item>
    </Grid>
  );
}
