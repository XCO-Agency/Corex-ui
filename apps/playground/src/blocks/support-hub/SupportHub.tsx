import * as React from "react";
import { Card, BlockStack, Grid, Text } from "@xco-agency/corex-ui";
import type { SupportHubPropsType } from "./types";
import {
  DEFAULT_TEAM_MEMBERS,
  DEFAULT_SUPPORT_HOURS,
  DEFAULT_SUPPORT_EMAIL,
  DEFAULT_QUICK_LINKS,
} from "./constants";
import { SupportContactCard } from "./partials/SupportContactCard";
import { SupportQuickLinks } from "./partials/SupportQuickLinks";

export function SupportHub({
  heading = "Explore more support",
  needHelpTitle = "Need help?",
  teamLabel = "We're here for you: Customer Care Team",
  teamMembers = DEFAULT_TEAM_MEMBERS,
  contactHeading = "Get in touch, we'd love to hear from you!",
  hours = DEFAULT_SUPPORT_HOURS,
  email = DEFAULT_SUPPORT_EMAIL,
  onChatClick,
  onBookCallClick,
  onEmailClick,
  quickLinks = DEFAULT_QUICK_LINKS,
}: SupportHubPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        {heading && (
          <Text variant="headingMd" as="h2" fontWeight="bold">
            {heading}
          </Text>
        )}

        <Grid columns={{ sm: 1, md: "2fr 1fr" }} gap="base">
          {/* Left Column: Customer Care & Hours */}
          <SupportContactCard
            needHelpTitle={needHelpTitle}
            teamLabel={teamLabel}
            teamMembers={teamMembers}
            contactHeading={contactHeading}
            hours={hours}
            email={email}
            onChatClick={onChatClick}
            onBookCallClick={onBookCallClick}
            onEmailClick={onEmailClick}
          />

          {/* Right Column: Feature Request & FAQ Cards */}
          <SupportQuickLinks links={quickLinks} />
        </Grid>
      </BlockStack>
    </Card>
  );
}
