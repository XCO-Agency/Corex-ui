import * as React from "react";
import {
  Box,
  BlockStack,
  InlineStack,
  Text,
  Divider,
  Button,
} from "@xco-agency/corex-ui";
import type { SupportTeamMemberType, SupportHoursType } from "../types";
import { SupportTeamAvatars } from "./SupportTeamAvatars";

export type SupportContactCardPropsType = {
  needHelpTitle?: string;
  teamLabel?: string;
  teamMembers: SupportTeamMemberType[];
  contactHeading?: string;
  hours: SupportHoursType;
  email: string;
  onChatClick?: () => void;
  onBookCallClick?: () => void;
  onEmailClick?: () => void;
};

export function SupportContactCard({
  needHelpTitle = "Need help?",
  teamMembers,
  contactHeading = "Get in touch, we'd love to hear from you!",
  hours,
  email,
  onChatClick,
  onBookCallClick,
  onEmailClick,
}: SupportContactCardPropsType) {
  return (
    <Box
      borderWidth="small-100"
      borderColor="border"
      borderRadius="base"
      background="bg-surface"
      padding="large-100"
    >
      <BlockStack gap="base">
        {/* Top Header: Need help + Avatars */}
        <InlineStack justifyContent="space-between" alignItems="center" gap="base" wrap={false}>
          <BlockStack gap="small-300">
            <Text variant="headingSm" as="h3" fontWeight="bold">
              {needHelpTitle}
            </Text>
            <BlockStack gap="none">
              <Text variant="bodySm">We're here for you:</Text>
              <Text variant="bodySm">Customer Care Team</Text>
            </BlockStack>
          </BlockStack>

          <SupportTeamAvatars members={teamMembers} />
        </InlineStack>

        <Divider />

        {/* Middle Section: Get in touch + Hours & Email */}
        <BlockStack gap="base">
          <Text variant="headingSm" fontWeight="bold" as="h4">
            {contactHeading}
          </Text>

          <InlineStack justifyContent="space-between" alignItems="flex-start" gap="base" wrap={false}>
            {/* Working hours */}
            <BlockStack gap="none">
              <Text variant="bodySm">{hours.days}</Text>
              <Text variant="bodySm">
                {hours.time} {hours.timezone}
              </Text>
            </BlockStack>

            {/* Email address */}
            <Text variant="bodySm">{email}</Text>
          </InlineStack>

          {/* Bottom Actions Row */}
          <InlineStack gap="small-300" wrap>
            <Button icon="chat" onClick={onChatClick}>
              Have a chat with us
            </Button>
            <Button icon="chat" onClick={onBookCallClick}>
              Book a call
            </Button>
            <Button icon="chat" onClick={onEmailClick}>
              Contact us via email
            </Button>
          </InlineStack>
        </BlockStack>
      </BlockStack>
    </Box>
  );
}
