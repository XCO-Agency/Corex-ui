import { useState } from "react";
import {
  Collapsible,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Divider,
} from "@xco-agency/corex-ui";

const FAQS = [
  {
    id: "returns",
    question: "What's your return policy?",
    answer:
      "Unused items can be returned within 30 days of delivery for a full refund. Return shipping is free for store credit, or a flat $5 fee for a refund to your original payment method.",
  },
  {
    id: "shipping",
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to over 40 countries. Rates and delivery estimates are calculated at checkout based on destination and package weight.",
  },
  {
    id: "support",
    question: "How do I contact support?",
    answer:
      "Reach our team anytime at support@example.com, or use the chat widget in the bottom-right corner for a reply within a few minutes during business hours.",
  },
];

export function CollapsibleFaqExample() {
  // Only one FAQ row open at a time — selecting another swaps the panel
  // instead of stacking it, the same tab-like pattern used for grouped cards.
  const [openId, setOpenId] = useState<string | null>("returns");

  return (
    <BlockStack gap="small-200">
      {FAQS.map((faq) => (
        <Collapsible
          key={faq.id}
          expanded={openId === faq.id}
          onExpandedChange={(expanded) => setOpenId(expanded ? faq.id : null)}
          content={
            <BlockStack gap="small-200">
              <Divider />
              <Text as="p" color="subdued">
                {faq.answer}
              </Text>
            </BlockStack>
          }
        >
          {({ expanded, toggle }) => (
            <InlineStack justifyContent="space-between" alignItems="center">
              <Text heading as="h4">
                {faq.question}
              </Text>
              <Button
                variant="tertiary"
                icon={expanded ? "chevron-up" : "chevron-down"}
                onClick={toggle}
                accessibilityLabel={expanded ? "Hide answer" : "Show answer"}
              />
            </InlineStack>
          )}
        </Collapsible>
      ))}
    </BlockStack>
  );
}
