import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Thumbnail,
  Avatar,
  Button,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import type { ReviewItemType, ReviewStatusType } from "../types";

type ReviewQueueCardPropsType = {
  reviews: ReviewItemType[];
  onUpdateStatus: (id: string, newStatus: ReviewStatusType) => void;
  onOpenReplyModal: (review: ReviewItemType) => void;
};

export function ReviewQueueCard({
  reviews,
  onUpdateStatus,
  onOpenReplyModal,
}: ReviewQueueCardPropsType) {
  if (reviews.length === 0) {
    return (
      <Card>
        <Box padding="large-100">
          <BlockStack gap="small-300" alignItems="center">
            <Text fontWeight="semibold" variant="large">
              No matching reviews found
            </Text>
            <Text color="subdued" variant="bodySm">
              Try adjusting your search terms or filter criteria.
            </Text>
          </BlockStack>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <Text as="h3" fontWeight="semibold">
            Moderation Queue ({reviews.length} reviews)
          </Text>
          <Text color="subdued" variant="bodySm">
            Showing most recent customer feedback submissions.
          </Text>
        </InlineStack>

        <Divider />

        <BlockStack gap="base">
          {reviews.map((review) => {
            const statusTone =
              review.status === "published"
                ? "success"
                : review.status === "pending"
                  ? "info"
                  : "critical";

            const sentimentTone =
              review.sentiment === "positive"
                ? "success"
                : review.sentiment === "neutral"
                  ? "neutral"
                  : "critical";

            return (
              <Box
                key={review.id}
                padding="base"
                background="base"
                borderRadius="base"
                borderWidth="small-100"
                borderColor="subdued"
                borderStyle="solid"
              >
                <BlockStack gap="small-300">
                  {/* Review Header: User info + Status badges */}
                  <InlineStack justifyContent="space-between" alignItems="flex-start">
                    <InlineStack gap="base" alignItems="center">
                      <Avatar name={review.authorName} size="medium" />
                      <BlockStack gap="small-500">
                        <InlineStack gap="small-200" alignItems="center">
                          <Text fontWeight="semibold" variant="bodySm">
                            {review.authorName}
                          </Text>
                          {review.verifiedBuyer && (
                            <Badge tone="success">Verified Buyer</Badge>
                          )}
                          <Badge tone={sentimentTone}>
                            {review.sentiment.toUpperCase()}
                          </Badge>
                        </InlineStack>
                        <Text color="subdued" variant="bodySm">
                          {review.authorEmail} · Submitted {review.createdAt}
                        </Text>
                      </BlockStack>
                    </InlineStack>

                    <InlineStack gap="small-200" alignItems="center">
                      <Badge tone={statusTone}>
                        {review.status.toUpperCase()}
                      </Badge>
                    </InlineStack>
                  </InlineStack>

                  {/* Product Associated */}
                  <Box
                    padding="small-200"
                    background="subdued"
                    borderRadius="base"
                  >
                    <InlineStack gap="small-200" alignItems="center">
                      <Thumbnail
                        source={review.productThumbnailSrc}
                        alt={review.productTitle}
                        size="small"
                      />
                      <Text variant="bodySm" fontWeight="medium">
                        Reviewed product: {review.productTitle}
                      </Text>
                    </InlineStack>
                  </Box>

                  {/* Stars + Title + Body */}
                  <BlockStack gap="small-400">
                    <InlineStack gap="small-200" alignItems="center">
                      <div
                        style={{
                          color: "#e49e00",
                          fontSize: "1rem",
                          letterSpacing: "1px",
                        }}
                      >
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                      <Text fontWeight="bold" variant="bodySm">
                        {review.title}
                      </Text>
                    </InlineStack>

                    <Text variant="bodySm">{review.body}</Text>
                  </BlockStack>

                  {/* Customer Uploaded Photos */}
                  {review.photos.length > 0 && (
                    <InlineStack gap="small-200" alignItems="center">
                      {review.photos.map((photo, i) => (
                        <div
                          key={i}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "var(--p-border-radius-100, 4px)",
                            overflow: "hidden",
                            border: "1px solid var(--p-color-border-subdued, #e1e3e5)",
                          }}
                        >
                          <img
                            src={photo}
                            alt={`Customer attachment ${i + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))}
                      <Text color="subdued" variant="bodySm">
                        ({review.photos.length} photo attachment{review.photos.length > 1 ? "s" : ""})
                      </Text>
                    </InlineStack>
                  )}

                  {/* Merchant Reply Section (if present) */}
                  {review.reply && (
                    <Box
                      padding="small-300"
                      background="subdued"
                      borderRadius="base"
                      borderWidth="small-100"
                      borderColor="subdued"
                      borderStyle="solid"
                    >
                      <BlockStack gap="small-500">
                        <InlineStack gap="small-200" alignItems="center">
                          <Text fontWeight="semibold" variant="bodySm">
                            {review.reply.author} (Merchant Response)
                          </Text>
                          <Text color="subdued" variant="bodySm">
                            · Replied on {review.reply.repliedAt}
                          </Text>
                        </InlineStack>
                        <Text variant="bodySm" color="subdued">
                          {review.reply.text}
                        </Text>
                      </BlockStack>
                    </Box>
                  )}

                  {/* Action Toolbar */}
                  <Divider />
                  <InlineStack justifyContent="space-between" alignItems="center">
                    <InlineStack gap="small-200">
                      {review.status !== "published" && (
                        <Button
                          variant="primary"
                          onClick={() => onUpdateStatus(review.id, "published")}
                        >
                          Publish Live
                        </Button>
                      )}

                      {review.status !== "flagged" && (
                        <Button
                          variant="secondary"
                          onClick={() => onUpdateStatus(review.id, "flagged")}
                        >
                          Flag Review
                        </Button>
                      )}

                      {review.status === "published" && (
                        <Button
                          variant="secondary"
                          onClick={() => onUpdateStatus(review.id, "hidden")}
                        >
                          Hide Review
                        </Button>
                      )}
                    </InlineStack>

                    <Button
                      variant="secondary"
                      onClick={() => onOpenReplyModal(review)}
                    >
                      {review.reply ? "Edit Public Reply" : "Reply to Customer"}
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Box>
            );
          })}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
