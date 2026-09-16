import * as React from "react";
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Image,
} from "@xco-agency/corex-ui";
import { DEFAULT_VIDEO_TUTORIAL_DATA } from "../constants";

export function VideoTutorialCompactExample() {
  return (
    <Box maxInlineSize="420px">
      <Card>
        <BlockStack gap="base">
          <Box borderRadius="large-100" overflow="hidden">
            <Image
              src={DEFAULT_VIDEO_TUTORIAL_DATA.thumbnailUrl}
              alt={DEFAULT_VIDEO_TUTORIAL_DATA.title}
              aspectRatio="16/9"
              objectFit="cover"
              borderRadius="large-100"
            />
          </Box>
          <BlockStack gap="small-200">
            <InlineStack justifyContent="space-between" alignItems="center" wrap={false} gap="base">
              <Text variant="headingSm" as="h3" fontWeight="semibold">
                {DEFAULT_VIDEO_TUTORIAL_DATA.title}
              </Text>
              <Button
                variant="tertiary"
                icon="menu-horizontal"
                accessibilityLabel="More options"
              />
            </InlineStack>
            <Text as="p" tone="subdued" variant="bodySm">
              {DEFAULT_VIDEO_TUTORIAL_DATA.description}
            </Text>
          </BlockStack>
        </BlockStack>
      </Card>
    </Box>
  );
}
