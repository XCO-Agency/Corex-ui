import { Badge, InlineStack } from "@xco/corex-ui";

export function BadgeVariants() {
  return (
    <InlineStack gap="small-200">
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="critical">Failed</Badge>
      <Badge tone="info">Draft</Badge>
    </InlineStack>
  );
}
