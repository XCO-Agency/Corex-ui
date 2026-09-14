import * as React from "react";
import {
  InlineStack,
  Text,
  Badge,
  Button,
  Box,
  BlockStack,
  Icon,
  IconTile,
} from "@xco-agency/corex-ui";
import type { ActivityTimelineItemPropsType } from "../types";
import { Divider } from "@xco-agency/corex-ui";

export function ActivityTimelineItem({
  item,
  isLast = false,
  onActionClick,
  onViewPayload,
}: ActivityTimelineItemPropsType) {
  return (
    <InlineStack gap="small" alignItems="stretch" position="relative">
      {/* Left Timeline Node & Connecting Line */}
      <BlockStack shrink inlineSize="28px" alignItems="center">
        <Box
          blockSize="28px"
          inlineSize="28px"
          background="base"
          border="base"
          borderRadius="large-200"
        >
          <InlineStack alignItems="center" justifyContent="center" blockSize="27px">
            <Icon type={item.icon} tone={item.iconTone} />
          </InlineStack>
        </Box>

        {!isLast && (
          <div
            style={{
              width: "1px",
              flex: 1,
              backgroundColor: "var(--p-color-border-subdued, #e1e3e5)",
              margin: "4px 0",
              minHeight: "24px",
            }}
          />
        )}
      </BlockStack>

      {/* Right Content Area */}
      <BlockStack flex={1} paddingBlockEnd={isLast ? "small-300" : "base"}>
        {/* Top Header Row: Title, Badge, and Timestamp */}
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="small-200"
          wrap
        >
          <InlineStack gap="small-200" alignItems="center">
            <Text variant="base" heading>
              {item.title}
            </Text>

            <Badge tone={item.badgeTone}>{item.badgeText}</Badge>
          </InlineStack>

          <Text as="span" variant="small" color="subdued">
            {item.timestamp}
          </Text>
        </InlineStack>

        {/* Subtitle / Description Text */}
        <Text color="subdued">{item.description}</Text>

        {/* Key-Value Details Container */}
        {item.details && item.details.length > 0 && (
          <BlockStack paddingBlock="small">
            <Box background="base" border="base" borderRadius="large" overflow="hidden">
              {item.details.map((detail, idx) => (
                <React.Fragment key={idx}>
                  <Box>
                    <InlineStack
                      justifyContent="space-between"
                      alignItems="center"
                      gap="small-200"

                      paddingBlock="small-200"
                      paddingInline="small"
                    >
                      <Text as="span" variant="small" color="subdued">
                        {detail.label}
                      </Text>
                      <Text variant="small" heading>
                        {detail.value}
                      </Text>
                    </InlineStack>
                  </Box>
                  {idx < item.details!.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </BlockStack>
        )}

        {/* Action Buttons Row */}
        {item.actions && item.actions.length > 0 && (
          <InlineStack gap="small-200" alignItems="center">
            {item.actions.map((act, idx) => (
              <Button
                key={idx}
                variant={act.variant ?? "secondary"}
                size="small"
                onClick={() => {
                  if (act.onClick) act.onClick();
                  if (onActionClick) onActionClick(act.label, item);
                }}
              >
                {act.label}
              </Button>
            ))}

            {item.payload && onViewPayload && (
              <Button variant="tertiary" size="small" onClick={() => onViewPayload(item)}>
                JSON Payload
              </Button>
            )}
          </InlineStack>
        )}
      </BlockStack>
    </InlineStack>
  );
}
