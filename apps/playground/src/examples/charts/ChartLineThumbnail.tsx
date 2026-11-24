import { Card, ChartLine } from "@xco-agency/corex-ui";

const dates = [
  "2026-11-01",
  "2026-11-02",
  "2026-11-03",
  "2026-11-04",
  "2026-11-05",
  "2026-11-06",
  "2026-11-07",
];
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/** One smooth line chart with a comparison period, used only for the Overview tile image. */
export function ChartLineThumbnail() {
  return (
    <Card heading="Sessions">
      <ChartLine
        ariaLabel="Sessions, Nov 1 – Nov 7"
        dates={dates}
        formatValue={String}
        formatDate={shortDate}
        series={[
          {
            id: "current",
            label: "Nov 1 – Nov 7",
            values: [120, 180, 150, 240, 210, 320, 290],
          },
          {
            id: "previous",
            label: "Oct 25 – Oct 31",
            values: [100, 130, 160, 140, 190, 200, 230],
            dashed: true,
          },
        ]}
      />
    </Card>
  );
}
