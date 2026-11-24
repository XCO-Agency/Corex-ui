import { BlockStack, Card, ChartBarList } from "@xco-agency/corex-ui";

const locations = [
  {
    id: "us",
    leading: "🇺🇸",
    label: "United States",
    value: 6420,
    display: "6,420",
    change: 12.4,
  },
  {
    id: "ca",
    leading: "🇨🇦",
    label: "Canada",
    value: 2310,
    display: "2,310",
    change: 4.8,
  },
  {
    id: "gb",
    leading: "🇬🇧",
    label: "United Kingdom",
    value: 1875,
    display: "1,875",
    change: -3.2,
  },
  { id: "fr", leading: "🇫🇷", label: "France", value: 1120, display: "1,120", change: 21 },
];

export function ChartBarListExample() {
  return (
    <BlockStack gap="base">
      <Card heading="Compact rows, details on hover">
        <ChartBarList ariaLabel="Sessions by location" items={locations} total={15840} />
      </Card>
      <Card heading="Details in the row (tooltip={false})">
        <ChartBarList
          ariaLabel="Sessions by location"
          items={locations}
          total={15840}
          tooltip={false}
        />
      </Card>
    </BlockStack>
  );
}
