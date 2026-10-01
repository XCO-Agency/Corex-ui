import { BlockStack, Card, Skeleton, SkeletonPage } from "@xco-agency/corex-ui";

export function SkeletonPageExample() {
  return (
    <SkeletonPage primaryAction>
      <Card>
        <BlockStack gap="small-200">
          <Skeleton height="1rem" />
          <Skeleton height="1rem" width="80%" />
          <Skeleton height="1rem" width="60%" />
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="small-200">
          <Skeleton height="1rem" width="40%" />
          <Skeleton height="4rem" />
        </BlockStack>
      </Card>
    </SkeletonPage>
  );
}
