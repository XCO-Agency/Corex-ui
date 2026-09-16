import * as React from "react";
import { Box, Image, Text, InlineStack, BlockStack } from "@xco-agency/corex-ui";
import type { SupportTeamMemberType } from "../types";

export type SupportTeamAvatarsPropsType = {
  members: SupportTeamMemberType[];
};

export function SupportTeamAvatars({ members }: SupportTeamAvatarsPropsType) {
  return (
    <InlineStack gap="base" alignItems="center">
      {members.map((member) => (
        <BlockStack key={member.name} gap="small-400" inlineAlign="center">
          <Box
            inlineSize="56px"
            blockSize="56px"
            borderRadius="full"
            overflow="hidden"
          >
            <Image
              src={member.avatarUrl}
              alt={member.name}
              aspectRatio="1/1"
              objectFit="cover"
              borderRadius="full"
            />
          </Box>
          <Text variant="bodySm">
            {member.name}
          </Text>
        </BlockStack>
      ))}
    </InlineStack>
  );
}
