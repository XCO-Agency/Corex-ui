import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Collapsible,
  Divider,
  Icon,
  Box,
} from "@xco-agency/corex-ui";
import type { PricingFaqPropsType } from "../types";
import { Clickable } from "@xco-agency/corex-ui";

export function PricingFaq({ items }: PricingFaqPropsType) {
  return (
    <Card padding="none">
      <BlockStack>
        <BlockStack gap="none" padding="base">
          <Text variant="base" heading>
            Frequently asked questions
          </Text>
          <Text variant="small" color="subdued">
            Everything you need to know about billing, trials, and plan limits.
          </Text>
        </BlockStack>

        <BlockStack>
          {items.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <Divider />}

              <Collapsible
                content={
                  <Box paddingInline="base" paddingBlock="small-300">
                    <Text variant="small" tone="neutral">
                      {item.answer}
                    </Text>
                  </Box>
                }
              >
                {({ expanded, toggle }) => (
                  <Clickable
                    onClick={toggle}

                    paddingInline="base"
                    paddingBlock="small-200"
                    inlineSize="fill"
                  >
                    <InlineStack justifyContent="space-between" alignItems="center">
                      <Text variant="small" heading>
                        {item.question}
                      </Text>

                      <Icon type={expanded ? "chevron-up" : "chevron-down"} />
                    </InlineStack>
                  </Clickable>
                )}
              </Collapsible>
            </React.Fragment>
          ))}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
