import { useState } from "react";
import { Badge, Banner, Button, InlineStack, Spinner, Tooltip } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function BadgeVariants() {
  return (
    <InlineStack gap="small-200">
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="critical">Failed</Badge>
      <Badge tone="info">Draft</Badge>
    </InlineStack>
  );
}

function BannerDismissible() {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return <Button onClick={() => setVisible(true)}>Show banner again</Button>;
  }
  return (
    <Banner title="Heads up" tone="warning" onDismiss={() => setVisible(false)}>
      Some line items are out of stock.
    </Banner>
  );
}

function SpinnerExample() {
  return <Spinner size="large" accessibilityLabel="Loading" />;
}

function TooltipExample() {
  return (
    <Tooltip content="Deletes the item permanently">
      <Button destructive>Delete</Button>
    </Tooltip>
  );
}

export const feedbackComponents: ComponentEntry[] = [
  {
    name: "Badge",
    slug: "badge",
    category: "Feedback",
    description: "A short status descriptor for a resource, such as an order or product state.",
    examples: [
      {
        title: "Tones",
        Example: BadgeVariants,
      },
    ],
  },
  {
    name: "Banner",
    slug: "banner",
    category: "Feedback",
    description: "Highlights important information or required actions prominently on the page.",
    examples: [
      {
        title: "Dismissible",
        Example: BannerDismissible,
      },
    ],
  },
  {
    name: "Spinner",
    slug: "spinner",
    category: "Feedback",
    description: "An animated loading indicator for content that is still being fetched.",
    examples: [
      {
        title: "Large spinner",
        Example: SpinnerExample,
      },
    ],
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    category: "Feedback",
    description: "Displays helpful information when hovering or focusing an element.",
    examples: [
      {
        title: "On a destructive action",
        Example: TooltipExample,
      },
    ],
  },
];
