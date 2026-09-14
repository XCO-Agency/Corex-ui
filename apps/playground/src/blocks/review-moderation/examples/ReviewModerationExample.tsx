import * as React from "react";
import {
  Page,
  BlockStack,
  Banner,
} from "@xco-agency/corex-ui";
import {
  MOCK_REVIEWS,
  MOCK_REVIEW_STATS,
} from "../constants";
import { ReviewRatingStatsCard } from "../partials/ReviewRatingStatsCard";
import { ReviewModerationToolbar } from "../partials/ReviewModerationToolbar";
import { ReviewQueueCard } from "../partials/ReviewQueueCard";
import { ReviewReplyModal } from "../partials/ReviewReplyModal";
import type {
  ReviewFilterFormType,
  ReviewItemType,
  ReviewStatusType,
} from "../types";

export function ReviewModerationExample() {
  const [reviews, setReviews] = React.useState<ReviewItemType[]>(MOCK_REVIEWS);
  const [stats] = React.useState(MOCK_REVIEW_STATS);
  const [filters, setFilters] = React.useState<ReviewFilterFormType>({
    status: "all",
    rating: "all",
    hasPhotosOnly: false,
    searchQuery: "",
  });

  const [activeReplyReview, setActiveReplyReview] =
    React.useState<ReviewItemType | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const handleFilterChange = <K extends keyof ReviewFilterFormType>(
    field: K,
    val: ReviewFilterFormType[K],
  ) => {
    setFilters((prev) => ({ ...prev, [field]: val }));
  };

  const handleUpdateStatus = (id: string, newStatus: ReviewStatusType) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    setNotification(`Review status updated to "${newStatus.toUpperCase()}".`);
  };

  const handlePublishAllPending = () => {
    const pendingCount = reviews.filter((r) => r.status === "pending").length;
    setReviews((prev) =>
      prev.map((r) => (r.status === "pending" ? { ...r, status: "published" } : r)),
    );
    setNotification(`Published ${pendingCount} pending customer review(s) live to store.`);
  };

  const handleOpenReplyModal = (review: ReviewItemType) => {
    setActiveReplyReview(review);
    setIsReplyModalOpen(true);
  };

  const handleSubmitReply = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: {
                text: replyText,
                repliedAt: "Just now",
                author: "Store Support",
              },
            }
          : r,
      ),
    );
    setNotification("Public merchant reply published successfully!");
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.rating !== "all") {
      if (filters.rating === "5" && r.rating !== 5) return false;
      if (filters.rating === "4" && r.rating !== 4) return false;
      if (filters.rating === "3_below" && r.rating > 3) return false;
    }
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchAuthor = r.authorName.toLowerCase().includes(q);
      const matchProduct = r.productTitle.toLowerCase().includes(q);
      const matchBody = r.body.toLowerCase().includes(q);
      if (!matchAuthor && !matchProduct && !matchBody) return false;
    }
    return true;
  });

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <Page
      heading="Review & UGC Moderation Center"
      subheading="Approve verified customer feedback, manage product UGC photos, and reply publicly to reviews."
      inlineSize="large"
    >
      <BlockStack gap="base">
        {notification && (
          <Banner
            tone="success"
            title={notification}
            onDismiss={() => setNotification(null)}
          />
        )}

        <ReviewRatingStatsCard stats={stats} />

        <ReviewModerationToolbar
          filters={filters}
          onChangeFilter={handleFilterChange}
          onPublishAllPending={handlePublishAllPending}
          onExportCsv={() =>
            setNotification("Exporting all review moderation logs to CSV format...")
          }
          pendingCount={pendingCount}
        />

        <ReviewQueueCard
          reviews={filteredReviews}
          onUpdateStatus={handleUpdateStatus}
          onOpenReplyModal={handleOpenReplyModal}
        />

        <ReviewReplyModal
          review={activeReplyReview}
          open={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          onSubmitReply={handleSubmitReply}
        />
      </BlockStack>
    </Page>
  );
}
