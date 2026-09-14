import * as React from "react";
import {
  Card,
  InlineStack,
  Text,
  Button,
} from "@xco-agency/corex-ui";

type SegmentActionsBarPropsType = {
  matchingCount: number;
  onExportCsv: () => void;
  onSendCampaign: () => void;
  onBulkTag: () => void;
};

export function SegmentActionsBar({
  matchingCount,
  onExportCsv,
  onSendCampaign,
  onBulkTag,
}: SegmentActionsBarPropsType) {
  return (
    <Card>
      <InlineStack justifyContent="space-between" alignItems="center">
        <Text variant="bodySm" color="subdued">
          Bulk Actions for {matchingCount.toLocaleString()} matching customers:
        </Text>
        <InlineStack gap="small-200">
          <Button variant="secondary" onClick={onExportCsv}>
            Export CSV
          </Button>
          <Button variant="secondary" onClick={onBulkTag}>
            Add Customer Tag
          </Button>
          <Button variant="primary" onClick={onSendCampaign}>
            Create Marketing Email
          </Button>
        </InlineStack>
      </InlineStack>
    </Card>
  );
}
