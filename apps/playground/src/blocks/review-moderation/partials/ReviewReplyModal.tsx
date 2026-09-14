import * as React from "react";
import {
  Modal,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Button,
  Box,
} from "@xco-agency/corex-ui";
import { CANNED_REPLIES } from "../constants";
import type { ReviewItemType } from "../types";

type ReviewReplyModalPropsType = {
  review: ReviewItemType | null;
  open: boolean;
  onClose: () => void;
  onSubmitReply: (reviewId: string, replyText: string) => void;
};

export function ReviewReplyModal({
  review,
  open,
  onClose,
  onSubmitReply,
}: ReviewReplyModalPropsType) {
  const [replyText, setReplyText] = React.useState("");

  React.useEffect(() => {
    if (review?.reply) {
      setReplyText(review.reply.text);
    } else {
      setReplyText("");
    }
  }, [review]);

  if (!review) return null;

  const handleApplyCanned = (text: string) => {
    setReplyText(text);
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    onSubmitReply(review.id, replyText.trim());
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Public Merchant Response"
      primaryAction={{
        content: "Publish Response",
        onAction: handleSend,
        disabled: !replyText.trim(),
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <BlockStack gap="base">
        {/* Original Review Context Box */}
        <Box
          padding="small-300"
          background="subdued"
          borderRadius="base"
        >
          <BlockStack gap="small-500">
            <InlineStack gap="small-200" alignItems="center">
              <Text fontWeight="semibold" variant="bodySm">
                {review.authorName} ({review.rating} Stars)
              </Text>
              <Text color="subdued" variant="bodySm">
                on {review.productTitle}
              </Text>
            </InlineStack>
            <Text variant="bodySm" color="subdued">
              &quot;{review.body}&quot;
            </Text>
          </BlockStack>
        </Box>

        {/* Quick Canned Replies */}
        <BlockStack gap="small-400">
          <Text fontWeight="medium" variant="bodySm">
            Quick Response Templates:
          </Text>
          <InlineStack gap="small-200" wrap>
            {CANNED_REPLIES.map((canned) => (
              <Button
                key={canned.id}
                variant="secondary"
                onClick={() => handleApplyCanned(canned.text)}
              >
                {canned.label}
              </Button>
            ))}
          </InlineStack>
        </BlockStack>

        {/* Response Body Textarea */}
        <TextField
          label="Your Public Reply"
          value={replyText}
          onChange={(val) => setReplyText(val)}
          multiline={4}
          placeholder="Write a considerate, helpful public reply from your brand team..."
          helpText="This response will be visible publicly directly beneath the customer's review on your storefront."
        />
      </BlockStack>
    </Modal>
  );
}
