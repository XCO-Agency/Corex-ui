import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Image,
  Checkbox,
} from "@xco-agency/corex-ui";
import type { MediaActionCardPropsType } from "../types";

export function MediaActionCard({
  title,
  description,
  imageUrl,
  imageAlt,
  badge,
  metaText,
  primaryAction,
  secondaryAction,
  selectable,
  selected = false,
  onSelectChange,
  onOptionsClick,
  children,
}: MediaActionCardPropsType) {
  return (
    <Box
      borderRadius="large-100"
      borderWidth={selected ? "050" : "0"}
      borderColor={selected ? "border" : "transparent"}
    >
      <Card>
        <BlockStack gap="base">
          <Box borderRadius="base" overflow="hidden">
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              aspectRatio="16/9"
              objectFit="cover"
              borderRadius="base"
            />
          </Box>

          <BlockStack gap="small-200">
            {(selectable || badge || onOptionsClick) && (
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
                  ) : (
                    selected && <Badge tone="success">Selected</Badge>
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
            )}

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

          {(primaryAction || secondaryAction) && (
            <InlineStack gap="small-200" alignItems="center">
              {primaryAction && (
                <Button
                  variant="primary"
                  onClick={primaryAction.onAction}
                  disabled={primaryAction.disabled}
                  loading={primaryAction.loading}
                  tone={primaryAction.destructive ? "critical" : undefined}
                >
                  {primaryAction.content}
                </Button>
              )}

              {secondaryAction && (
                <Button
                  variant="secondary"
                  onClick={secondaryAction.onAction}
                  disabled={secondaryAction.disabled}
                  loading={secondaryAction.loading}
                >
                  {secondaryAction.content}
                </Button>
              )}
            </InlineStack>
          )}
        </BlockStack>
      </Card>
    </Box>
  );
}
