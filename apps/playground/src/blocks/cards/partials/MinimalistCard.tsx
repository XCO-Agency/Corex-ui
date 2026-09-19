import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Checkbox,
} from "@xco-agency/corex-ui";
import type { MinimalistCardPropsType } from "../types";

export function MinimalistCard({
  title,
  description,
  badge,
  metaText,
  selectable,
  selected = false,
  onSelectChange,
  onOptionsClick,
  children,
}: MinimalistCardPropsType) {
  return (
    <Box
      borderRadius="large-100"
      borderWidth={selected ? "050" : "0"}
      borderColor={selected ? "border" : "transparent"}
    >
      <Card>
        <BlockStack gap="small-300">
          <InlineStack justifyContent="space-between" alignItems="center" gap="small-200">
            <InlineStack gap="small-200" alignItems="center">
              {selectable && (
                <Checkbox
                  label=""
                  checked={selected}
                  onChange={(val) => onSelectChange?.(val)}
                />
              )}

              {badge ? (
                <Badge tone={selected ? "success" : badge.tone}>
                  {selected ? "Selected" : badge.text}
                </Badge>
              ) : selected ? (
                <Badge tone="success">Selected</Badge>
              ) : (
                <Text variant="bodySm" color="subdued">
                  Tip
                </Text>
              )}
            </InlineStack>

            {onOptionsClick && (
              <Button
                variant="tertiary"
                icon="menu-horizontal"
                accessibilityLabel="More options"
                onClick={onOptionsClick}
              />
            )}
          </InlineStack>

          <Text variant="headingMd" as="h3" fontWeight="semibold">
            {title}
          </Text>

          <Text variant="bodyMd" as="p" color="subdued">
            {description}
          </Text>

          {metaText && (
            <Text variant="bodySm" color="subdued">
              {metaText}
            </Text>
          )}

          {children}
        </BlockStack>
      </Card>
    </Box>
  );
}
