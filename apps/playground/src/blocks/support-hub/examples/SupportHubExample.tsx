import * as React from "react";
import {
  Box,
  BlockStack,
  Modal,
  Text,
  InlineStack,
  Button,
  TextField,
} from "@xco-agency/corex-ui";
import { SupportHub } from "../SupportHub";
import {
  DEFAULT_TEAM_MEMBERS,
  DEFAULT_SUPPORT_HOURS,
  DEFAULT_SUPPORT_EMAIL,
  DEFAULT_QUICK_LINKS,
} from "../constants";

export function SupportHubExample() {
  const [activeModal, setActiveModal] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [featureFeedback, setFeatureFeedback] = React.useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const interactiveLinks = DEFAULT_QUICK_LINKS.map((link) => ({
    ...link,
    onClick: () => setActiveModal(link.id),
  }));

  return (
    <BlockStack gap="base">
      <SupportHub
        heading="Explore more support"
        teamMembers={DEFAULT_TEAM_MEMBERS}
        hours={DEFAULT_SUPPORT_HOURS}
        email={DEFAULT_SUPPORT_EMAIL}
        quickLinks={interactiveLinks}
        onChatClick={() => showToast("Opening live chat session with Customer Care...")}
        onBookCallClick={() => setActiveModal("book-call")}
        onEmailClick={() => showToast("Composing email to support@cartly-pro.com...")}
      />

      {/* Toast Notification */}
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

      {/* Feature Request Modal */}
      {activeModal === "feature-request" && (
        <Modal
          open={true}
          onClose={() => setActiveModal(null)}
          title="Submit a Feature Request"
        >
          <Box padding="base">
            <BlockStack gap="base">
              <Text variant="bodyMd">
                Have an idea to make the app even better, or spotted a bug? Let our team know!
              </Text>
              <TextField
                label="Feature description"
                placeholder="Describe your request or use case..."
                multiline={4}
                value={featureFeedback}
                onChange={(val) => setFeatureFeedback(val)}
              />
              <InlineStack justifyContent="flex-end" gap="small-300">
                <Button variant="secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setActiveModal(null);
                    setFeatureFeedback("");
                    showToast("Thank you! Your feedback has been sent to our product team.");
                  }}
                >
                  Send Feedback
                </Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Modal>
      )}

      {/* FAQ Modal */}
      {activeModal === "faq" && (
        <Modal
          open={true}
          onClose={() => setActiveModal(null)}
          title="Frequently Asked Questions (FAQ)"
        >
          <Box padding="base">
            <BlockStack gap="base">
              <BlockStack gap="small-500">
                <Text variant="bodyMd" fontWeight="semibold">
                  How do I enable the cart drawer in my theme?
                </Text>
                <Text variant="bodySm" tone="subdued">
                  Navigate to Online Store &gt; Themes &gt; Customize, then enable the App Embed for Cart Drawer.
                </Text>
              </BlockStack>
              <BlockStack gap="small-500">
                <Text variant="bodyMd" fontWeight="semibold">
                  Can I customize the upsell recommendations?
                </Text>
                <Text variant="bodySm" tone="subdued">
                  Yes, under the Addons tab you can create manual collections or AI-driven cross-sells.
                </Text>
              </BlockStack>
            </BlockStack>
          </Box>
        </Modal>
      )}

      {/* Book Call Modal */}
      {activeModal === "book-call" && (
        <Modal
          open={true}
          onClose={() => setActiveModal(null)}
          title="Schedule a 1-on-1 Onboarding Call"
        >
          <Box padding="base">
            <BlockStack gap="base">
              <Text variant="bodyMd">
                Schedule a 15-minute screen share with Ihar or Marina from our Customer Care team.
              </Text>
              <InlineStack justifyContent="flex-end" gap="small-300">
                <Button variant="secondary" onClick={() => setActiveModal(null)}>
                  Dismiss
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setActiveModal(null);
                    showToast("Opening calendar booking page...");
                  }}
                >
                  Select Time Slot
                </Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Modal>
      )}
    </BlockStack>
  );
}
