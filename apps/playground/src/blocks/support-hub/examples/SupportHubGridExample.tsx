import * as React from "react";
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Grid,
  Text,
  Badge,
  Button,
  Icon,
} from "@xco-agency/corex-ui";
import { SupportTeamAvatars } from "../partials/SupportTeamAvatars";
import {
  DEFAULT_TEAM_MEMBERS,
  DEFAULT_SUPPORT_HOURS,
  DEFAULT_SUPPORT_EMAIL,
} from "../constants";

export function SupportHubGridExample() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <BlockStack gap="base">
      <Grid columns={{ sm: 1, md: 3 }} gap="base">
        {/* Card 1: Live Chat & Customer Care */}
        <Card>
          <BlockStack gap="base">
            <BlockStack gap="small-300">
              <InlineStack justifyContent="space-between" alignItems="center">
                <Text variant="headingSm" as="h3" fontWeight="bold">
                  Live Customer Care
                </Text>
                <Badge tone="success" size="small">
                  Active
                </Badge>
              </InlineStack>

              <SupportTeamAvatars members={DEFAULT_TEAM_MEMBERS} />

              <Text variant="bodySm" tone="subdued" as="p">
                Chat with Ihar, Marina, or Andrii for instant troubleshooting and setup assistance.
              </Text>

              <Text variant="xs" tone="subdued">
                {DEFAULT_SUPPORT_HOURS.days} &bull; {DEFAULT_SUPPORT_HOURS.time}
              </Text>
            </BlockStack>

            <Button
              fullWidth
              variant="primary"
              icon="chat"
              onClick={() => showToast("Opening live chat session...")}
            >
              Have a chat with us
            </Button>
          </BlockStack>
        </Card>

        {/* Card 2: 1-on-1 Onboarding Call */}
        <Card>
          <BlockStack gap="base">
            <BlockStack gap="small-300">
              <InlineStack justifyContent="space-between" alignItems="center">
                <Text variant="headingSm" as="h3" fontWeight="bold">
                  1-on-1 Setup Call
                </Text>
                <Badge tone="info" size="small">
                  Free
                </Badge>
              </InlineStack>

              <Icon type="calendar" tone="info" />

              <Text variant="bodySm" tone="subdued" as="p">
                Schedule a 15-minute video screenshare to customize your cart drawer and configure upsell rules.
              </Text>

              <Text variant="xs" tone="subdued">
                Google Meet link generated automatically
              </Text>
            </BlockStack>

            <Button
              fullWidth
              icon="calendar"
              onClick={() => showToast("Opening calendar booking...")}
            >
              Book a call
            </Button>
          </BlockStack>
        </Card>

        {/* Card 3: Direct Email Support */}
        <Card>
          <BlockStack gap="base">
            <BlockStack gap="small-300">
              <InlineStack justifyContent="space-between" alignItems="center">
                <Text variant="headingSm" as="h3" fontWeight="bold">
                  Email Desk
                </Text>
                <Badge tone="neutral" size="small">
                  24/7
                </Badge>
              </InlineStack>

              <Icon type="email" tone="info" />

              <Text variant="bodySm" tone="subdued" as="p">
                Send technical inquiries or custom CSS styling requests directly to our developer team.
              </Text>

              <Text variant="xs" tone="subdued">
                {DEFAULT_SUPPORT_EMAIL}
              </Text>
            </BlockStack>

            <Button
              fullWidth
              icon="email"
              onClick={() => showToast(`Composing email to ${DEFAULT_SUPPORT_EMAIL}...`)}
            >
              Contact us via email
            </Button>
          </BlockStack>
        </Card>
      </Grid>

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
