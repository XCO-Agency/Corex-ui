import { BlockStack, ChartSparkline, InlineStack, Text } from "@xco-agency/corex-ui";

const trend = [4, 6, 5, 9, 8, 12, 11, 15];

export function ChartSparklineExample() {
  return (
    <BlockStack gap="base">
      {(["auto", "success", "critical", "info"] as const).map((tone) => (
        <InlineStack key={tone} gap="base" alignItems="center">
          <ChartSparkline values={trend} color={tone} ariaLabel={`${tone} trend`} />
          <Text as="span" color="subdued">
            {tone}
          </Text>
        </InlineStack>
      ))}
      <InlineStack gap="base" alignItems="center">
        <ChartSparkline
          values={trend}
          width={240}
          height={48}
          color="info"
          ariaLabel="Large trend"
        />
        <Text as="span" color="subdued">
          width 240, height 48
        </Text>
      </InlineStack>
    </BlockStack>
  );
}
