import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import { TEMPLATE_VARIABLE_TAGS } from "../constants";

type DynamicVariablesCardPropsType = {
  onInsertTag: (tag: string) => void;
};

export function DynamicVariablesCard({ onInsertTag }: DynamicVariablesCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="small-400">
          <Text as="h3" fontWeight="semibold">
            Insert Dynamic Liquid Variables
          </Text>
          <Text color="subdued" variant="bodySm">
            Click any placeholder tag below to insert it at cursor position in your template.
          </Text>
        </BlockStack>

        <InlineStack gap="small-200" wrap>
          {TEMPLATE_VARIABLE_TAGS.map((t) => (
            <Button
              key={t.key}
              variant="secondary"
              onClick={() => onInsertTag(t.key)}
            >
              + {t.label} ({t.key})
            </Button>
          ))}
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
