import * as React from "react";
import {
  Card,
  InlineStack,
  BlockStack,
  Text,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import type { OfferSaveBarPropsType } from "../types";

export function OfferSaveBar({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}: OfferSaveBarPropsType) {
  if (!isDirty) return null;

  return (
    <div
      style={{
        position: "sticky",
        bottom: "16px",
        zIndex: 50,
        width: "100%",
      }}
    >
      <Card>
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="base"
          wrap
        >
          <InlineStack gap="small-200" alignItems="center">
            <Badge tone="warning">Unsaved changes</Badge>
            <Text as="span" variant="small">
              You have unsaved changes to this campaign configuration.
            </Text>
          </InlineStack>

          <InlineStack gap="small-200" alignItems="center">
            <Button
              variant="secondary"
              disabled={isSaving}
              onClick={onDiscard}
            >
              Discard
            </Button>
            <Button
              variant="primary"
              loading={isSaving}
              onClick={onSave}
            >
              Save offer
            </Button>
          </InlineStack>
        </InlineStack>
      </Card>
    </div>
  );
}
