import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChartSparkline } from "@xco-agency/corex-ui";
import { ChartCard } from "../partials/ChartCard";
import { ChangeIndicator } from "../partials/ChangeIndicator";
import { dayRange, percentChange, periodSeries } from "../utils";

describe("period helpers", () => {
  it("gives a change only against a real previous value", () => {
    expect(percentChange(134, 100)).toBe(34);
    expect(percentChange(50, 100)).toBe(-50);
    expect(percentChange(10, 0)).toBeNull();
    expect(percentChange(10, null)).toBeNull();
  });

  it("lists the days of a range", () => {
    expect(dayRange("2026-10-30", "2026-11-02")).toEqual([
      "2026-10-30",
      "2026-10-31",
      "2026-11-01",
      "2026-11-02",
    ]);
  });

  it("splits daily rows into the period and the one before, filling gaps", () => {
    const series = periodSeries(
      [
        { date: "2026-11-01", n: 4 },
        { date: "2026-11-03", n: 6 },
        { date: "2026-10-29", n: 2 },
      ],
      {
        previousFrom: "2026-10-28",
        currentFrom: "2026-11-01",
        to: "2026-11-04",
      },
      (row) => row.n,
    );
    expect(series.dates).toEqual([
      "2026-11-01",
      "2026-11-02",
      "2026-11-03",
      "2026-11-04",
    ]);
    expect(series.current).toEqual([4, 0, 6, 0]);
    expect(series.previousDates).toEqual([
      "2026-10-28",
      "2026-10-29",
      "2026-10-30",
      "2026-10-31",
    ]);
    expect(series.previous).toEqual([0, 2, 0, 0]);
  });

  it("draws no comparison for a previous period without data", () => {
    const series = periodSeries(
      [{ date: "2026-11-02", n: 1 }],
      {
        previousFrom: "2026-10-28",
        currentFrom: "2026-11-01",
        to: "2026-11-04",
      },
      (row) => row.n,
    );
    expect(series.previous).toBeNull();
  });
});

describe("ChartCard", () => {
  it("shows the title, the value with its change and the chart", () => {
    const html = renderToStaticMarkup(
      <ChartCard
        heading="Sessions"
        tooltip="Visits to the store"
        value="1,204"
        change={8.2}
      >
        <ChartSparkline values={[1, 2]} ariaLabel="Sessions trend" />
      </ChartCard>,
    );
    expect(html).toContain("Sessions");
    expect(html).toContain("Visits to the store");
    expect(html).toContain(">1,204<");
    expect(html).toContain("↗ 8.2%");
    expect(html).toContain('aria-label="Sessions trend"');
  });
});
