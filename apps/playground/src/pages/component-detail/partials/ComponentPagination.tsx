import { useNavigate } from "react-router-dom";
import {
  BlockStack,
  Box,
  Clickable,
  Divider,
  Icon,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";
import type { ComponentNavigationItemType } from "../types";

export type ComponentPaginationPropsType = {
  prev: ComponentNavigationItemType;
  next: ComponentNavigationItemType;
  /** `/components` or `/blocks`. */
  basePath?: string;
};

export function ComponentPagination({
  prev,
  next,
  basePath = "/components",
}: ComponentPaginationPropsType) {
  const navigate = useNavigate();
  if (!prev && !next) return null;

  return (
    <BlockStack gap="small">
      <Divider />
      <InlineStack alignItems="start" justifyContent="space-between" gap="base">
        {prev ? (
          <Clickable
            onClick={() => navigate(`${basePath}/${prev.slug}`)}
            padding="small-200"
          >
            <BlockStack gap="small-500">
              <Text color="subdued" variant="small">
                Previous
              </Text>
              <InlineStack alignItems="center" gap="small-300">
                <Icon source="arrow-left" />
                <Text fontWeight="medium">{prev.name}</Text>
              </InlineStack>
            </BlockStack>
          </Clickable>
        ) : (
          <Box />
        )}
        {next ? (
          <Clickable
            onClick={() => navigate(`${basePath}/${next.slug}`)}
            padding="small-200"
          >
            <BlockStack gap="small-500" alignItems="end">
              <Text color="subdued" variant="small">
                Next
              </Text>
              <InlineStack alignItems="center" gap="small-300">
                <Text fontWeight="medium">{next.name}</Text>
                <Icon source="arrow-right" />
              </InlineStack>
            </BlockStack>
          </Clickable>
        ) : null}
      </InlineStack>
    </BlockStack>
  );
}
