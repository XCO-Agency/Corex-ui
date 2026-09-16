import * as React from "react";
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import { SupportTeamAvatars } from "../partials/SupportTeamAvatars";
import {
  DEFAULT_TEAM_MEMBERS,
  DEFAULT_SUPPORT_HOURS,
  DEFAULT_SUPPORT_EMAIL,
} from "../constants";

export function SupportHubBannerExample() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <BlockStack gap="base">
      <Card>
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="base"
          wrap
        >
          {/* Left Column: Avatars & Status */}
          <InlineStack gap="base" alignItems="center" wrap>
            <SupportTeamAvatars members={DEFAULT_TEAM_MEMBERS} />

            <BlockStack gap="small-500">
              <InlineStack gap="small-300" alignItems="center">
                <Text variant="headingSm" as="h3" fontWeight="bold">
                  Need help? We&apos;re here for you
                </Text>
                <Badge tone="success" size="small">
                  Online now
                </Badge>
              </InlineStack>

              <Text variant="bodySm" tone="subdued" as="p">
                Customer Care Team &bull; {DEFAULT_SUPPORT_HOURS.days} ({DEFAULT_SUPPORT_HOURS.time})
              </Text>
            </BlockStack>
          </InlineStack>

          {/* Right Column: 3 Contact Buttons */}
          <InlineStack gap="small-300" alignItems="center" wrap>
            <Button
              icon="chat"
              onClick={() => showToast("Starting live chat session...")}
            >
              Have a chat with us
            </Button>
            <Button
              icon="calendar"
              onClick={() => showToast("Opening call scheduler...")}
            >
              Book a call
            </Button>
            <Button
              icon="email"
              onClick={() => showToast(`Opening email client to ${DEFAULT_SUPPORT_EMAIL}...`)}
            >
              Contact us via email
            </Button>
          </InlineStack>
        </InlineStack>
      </Card>

      {/* Toast Notice */}
      {toastMessage && (
        <Box
          background="bg-surface-secondary"
          padding="small-200 base"
          borderRadius="small"
        >
          <Text tone="success" fontWeight="medium">
            ✓ {toastMessage}
          </Text>
        </Box>
      )}
    </BlockStack>
  );
}
