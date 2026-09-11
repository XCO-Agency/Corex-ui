import { BlockStack, InlineStack, Card, Skeleton } from "@xco-agency/corex-ui";

export function SkeletonBasicExample() {
  return (
    <BlockStack gap="base" style={{ width: "100%" }}>
      <Card>
        <BlockStack gap="base">
          {/* Avatar and title row with small and full radius */}
          <InlineStack gap="base" alignItems="center">
            <Skeleton width={48} height={48} borderRadius="full" />
            <div
              style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <Skeleton width="45%" height={18} borderRadius="small" />
              <Skeleton width="25%" height={14} borderRadius="small" />
            </div>
          </InlineStack>

          {/* Media box / banner placeholder with default base radius */}
          <Skeleton width="100%" height={120} borderRadius="base" />

          {/* Content lines with varying dynamic widths and small radius */}
          <BlockStack gap="small-200">
            <Skeleton width="100%" height={14} borderRadius="small" />
            <Skeleton width="90%" height={14} borderRadius="small" />
            <Skeleton width="60%" height={14} borderRadius="small" />
          </BlockStack>

          {/* Action button placeholders with large radius */}
          <InlineStack gap="small" justifyContent="end">
            <Skeleton width={80} height={32} borderRadius="large" />
            <Skeleton width={100} height={32} borderRadius="large" />
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
