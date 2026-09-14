import * as React from "react";
import {
  Card,
  InlineStack,
  TextField,
  Select,
  Button,
} from "@xco-agency/corex-ui";
import type { ReviewFilterFormType, ReviewStatusType } from "../types";

type ReviewModerationToolbarPropsType = {
  filters: ReviewFilterFormType;
  onChangeFilter: <K extends keyof ReviewFilterFormType>(
    field: K,
    val: ReviewFilterFormType[K],
  ) => void;
  onPublishAllPending: () => void;
  onExportCsv: () => void;
  pendingCount: number;
};

const STATUS_OPTIONS = [
  { label: "All Moderation Statuses", value: "all" },
  { label: "Published Live", value: "published" },
  { label: "Pending Approval", value: "pending" },
  { label: "Flagged for Attention", value: "flagged" },
];

const RATING_OPTIONS = [
  { label: "All Star Ratings", value: "all" },
  { label: "5 Stars Only", value: "5" },
  { label: "4 Stars Only", value: "4" },
  { label: "3 Stars & Below", value: "3_below" },
];

export function ReviewModerationToolbar({
  filters,
  onChangeFilter,
  onPublishAllPending,
  onExportCsv,
  pendingCount,
}: ReviewModerationToolbarPropsType) {
  return (
    <Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) 180px 180px auto",
          gap: "var(--p-space-300, 12px)",
          alignItems: "end",
        }}
      >
        <TextField
          label="Search Reviews"
          value={filters.searchQuery}
          onChange={(val) => onChangeFilter("searchQuery", val)}
          placeholder="Filter by customer name, product, or review copy..."
        />

        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(val) => onChangeFilter("status", val as "all" | ReviewStatusType)}
        />

        <Select
          label="Rating"
          options={RATING_OPTIONS}
          value={filters.rating}
          onChange={(val) => onChangeFilter("rating", val)}
        />

        <InlineStack gap="small-200">
          <Button
            variant="secondary"
            onClick={onPublishAllPending}
            disabled={pendingCount === 0}
          >
            Publish Pending ({pendingCount})
          </Button>
          <Button variant="secondary" onClick={onExportCsv}>
            Export
          </Button>
        </InlineStack>
      </div>
    </Card>
  );
}
