import { Card, ChartBar } from "@xco-agency/corex-ui";

const orders = [12, 18, 9, 24, 21, 30, 27];
const before = [10, 14, 12, 16, 19, 22, 20];
const dates = [
  "2026-11-01",
  "2026-11-02",
  "2026-11-03",
  "2026-11-04",
  "2026-11-05",
  "2026-11-06",
  "2026-11-07",
];
const previousDates = [
  "2026-10-25",
  "2026-10-26",
  "2026-10-27",
  "2026-10-28",
  "2026-10-29",
  "2026-10-30",
  "2026-10-31",
];

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export function ChartBarExample() {
  return (
    <Card heading="Orders per day">
      <ChartBar
        ariaLabel="Orders, Nov 1 – Nov 7"
        label="Orders"
        comparisonLabel="Previous week"
        comparisonDates={previousDates}
        formatValue={String}
        formatDate={shortDate}
        data={dates.map((date, i) => ({
          date,
          value: orders[i] ?? 0,
          comparison: before[i],
        }))}
      />
    </Card>
  );
}
