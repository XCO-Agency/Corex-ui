import { BlockStack, Card, ChartLine, Text } from "@xco-agency/corex-ui";

const dates = [
  "2026-11-01",
  "2026-11-02",
  "2026-11-03",
  "2026-11-04",
  "2026-11-05",
  "2026-11-06",
  "2026-11-07",
];
const current = [120, 180, 150, 240, 210, 320, 290];
const previous = [100, 130, 160, 140, 190, 200, 230];

const number = new Intl.NumberFormat("en-US");
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export function ChartLineExample() {
  return (
    <BlockStack gap="base">
      <Card heading="Smooth (default), with a comparison period">
        <ChartLine
          ariaLabel="Sessions, Nov 1 – Nov 7"
          dates={dates}
          formatValue={number.format}
          formatDate={shortDate}
          series={[
            { id: "current", label: "Nov 1 – Nov 7", values: current },
            { id: "previous", label: "Oct 25 – Oct 31", values: previous, dashed: true },
          ]}
        />
      </Card>
      <Card heading="Sharp">
        <BlockStack gap="small-200">
          <Text as="p" color="subdued">
            Straight segments with curve="sharp".
          </Text>
          <ChartLine
            curve="sharp"
            ariaLabel="Sessions, Nov 1 – Nov 7"
            dates={dates}
            formatValue={number.format}
            formatDate={shortDate}
            series={[{ id: "current", label: "Nov 1 – Nov 7", values: current }]}
          />
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
