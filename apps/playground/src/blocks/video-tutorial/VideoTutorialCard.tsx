import * as React from "react";
import {
  Card,
  Box,
  InlineStack,
  BlockStack,
  Text,
  Button,
  Image,
} from "@xco-agency/corex-ui";
import type { VideoTutorialBlockPropsType } from "./types";
import { DEFAULT_VIDEO_TUTORIAL_DATA } from "./constants";

export function VideoTutorialCard({
  title = DEFAULT_VIDEO_TUTORIAL_DATA.title,
  description = DEFAULT_VIDEO_TUTORIAL_DATA.description,
  thumbnailUrl = DEFAULT_VIDEO_TUTORIAL_DATA.thumbnailUrl,
  onPlay,
  onOptionsClick,
}: VideoTutorialBlockPropsType) {
  return (
    <Card>
      <InlineStack gap="large-100" alignItems="center" wrap={false}>
        <Box
          minInlineSize="340px"
          maxInlineSize="380px"
          borderRadius="large-100"
          overflow="hidden"
          onClick={onPlay}
        >
          <Image
            src={thumbnailUrl}
            alt={title}
            aspectRatio="16/9"
            objectFit="cover"
            borderRadius="large-100"
          />
        </Box>

        <Box minInlineSize="0">
          <BlockStack gap="small-200">
            <InlineStack justifyContent="space-between" alignItems="center" wrap={false} gap="base">
              <Text variant="headingMd" as="h2" fontWeight="semibold">
                {title}
              </Text>
              <Button
                variant="tertiary"
                icon="menu-horizontal"
                accessibilityLabel="More options"
                onClick={onOptionsClick}
              />
            </InlineStack>

            <Text as="p" tone="subdued" variant="bodyMd">
              {description}
            </Text>
          </BlockStack>
        </Box>
      </InlineStack>
    </Card>
  );
}
