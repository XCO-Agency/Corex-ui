import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ChartBar } from "./ChartBar";
import { ChartBarList } from "./ChartBarList";
import { ChartChange } from "./ChartChange";
import { ChartDonut } from "./ChartDonut";
import { ChartFunnel } from "./ChartFunnel";
import { ChartLine } from "./ChartLine";
import { ChartSparkline } from "./ChartSparkline";
import { CHART_COLORS } from "./Chart.constants";
import { chartAxisTicks, chartLabelIndexes, chartValueScale } from "./Chart.utils";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const fmt = (n: number) => String(n);
const day = (d: string) => d.slice(5);

describe("chart scales", () => {
  it("rounds the axis to about four steps of 1, 2 or 5", () => {
    expect(chartAxisTicks(90)).toEqual([0, 50, 100]);
    expect(chartAxisTicks(120)).toEqual([0, 50, 100, 150]);
    expect(chartAxisTicks(0)).toEqual([0, 1]);
    expect(chartValueScale([3, null, 7.5])).toEqual({ ticks: [0, 2, 4, 6, 8], max: 8 });
  });

  it("labels the first, the last and evenly spaced days between", () => {
    expect(chartLabelIndexes(3)).toEqual([0, 1, 2]);
    expect(chartLabelIndexes(31)).toEqual([0, 6, 12, 18, 24, 30]);
    expect(chartLabelIndexes(0)).toEqual([]);
  });
});

const lineMarkup = (dashed: boolean) =>
  renderToStaticMarkup(
    <>
      <ChartLine
        ariaLabel="Views, Nov 1 – Nov 4"
        dates={["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04"]}
        formatValue={fmt}
        formatDate={day}
        series={[
          { id: "current", label: "Nov 1 – Nov 4", values: [10, 40, 25, 90] },
          ...(dashed
            ? [
                {
                  id: "previous",
                  label: "Oct 28 – Oct 31",
                  values: [5, 20, 30, 40],
                  dashed: true,
                },
              ]
            : []),
        ]}
      />
    </>,
  );

describe("ChartLine", () => {
  it("draws a solid current line and a light dashed previous one", () => {
    const html = lineMarkup(true);
    const current = html.match(/<path data-series="current"[^>]*>/)?.[0];
    const previous = html.match(/<path data-series="previous"[^>]*>/)?.[0];

    expect(current).toContain(`stroke="${CHART_COLORS.primary}"`);
    expect(current).not.toContain("stroke-dasharray");
    expect(previous).toContain(`stroke="${CHART_COLORS.comparison}"`);
    expect(previous).toContain('stroke-dasharray="5 4"');
    // Labelled gridlines from 0, dates along the bottom, a legend.
    for (const tick of [">0<", ">50<", ">100<"]) {
      expect(html).toContain(tick);
    }
    expect(html).toContain(">11-01<");
    expect(html).toContain(">11-04<");
    expect(html).toContain(">Oct 28 – Oct 31<");
    expect(html).toContain("<title");
  });

  it("has only the current line without a previous period", () => {
    expect(lineMarkup(false)).not.toContain('data-series="previous"');
  });
});

describe("chart tooltips by keyboard", () => {
  let root: Root;
  let host: HTMLDivElement;
  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it("shows the focused day's values and moves with the arrow keys", () => {
    act(() =>
      root.render(
        <>
          <ChartLine
            ariaLabel="Views"
            dates={["2026-11-01", "2026-11-02"]}
            formatValue={fmt}
            formatDate={day}
            series={[
              {
                id: "current",
                label: "This period",
                values: [10, 40],
                dates: ["2026-11-01", "2026-11-02"],
              },
              {
                id: "previous",
                label: "Previous period",
                values: [7, 9],
                dates: ["2026-10-30", "2026-10-31"],
                dashed: true,
              },
            ]}
          />
        </>,
      ),
    );
    const svg = host.querySelector("svg[role=group]") as SVGSVGElement;
    expect(svg.getAttribute("tabindex")).toBe("0");
    expect(host.querySelector("[data-chart-tooltip]")).toBeNull();

    act(() => svg.dispatchEvent(new FocusEvent("focusin", { bubbles: true })));
    // Focus starts on the latest day, both periods side by side.
    let tip = host.querySelector("[data-chart-tooltip]")?.textContent ?? "";
    expect(tip).toContain("11-02");
    expect(tip).toContain("40");
    expect(tip).toContain("10-31");
    expect(tip).toContain("9");

    act(() =>
      svg.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
      ),
    );
    tip = host.querySelector("[data-chart-tooltip]")?.textContent ?? "";
    expect(tip).toContain("11-01");
    expect(tip).toContain("10");

    act(() =>
      svg.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })),
    );
    expect(host.querySelector("[data-chart-tooltip]")).toBeNull();
  });
});

describe("ChartBar", () => {
  it("draws a bar per day with a day of nothing left empty", () => {
    const html = renderToStaticMarkup(
      <>
        <ChartBar
          ariaLabel="Sorts per day"
          label="Sorts per day"
          data={[
            { date: "2026-11-01", value: 118 },
            { date: "2026-11-02", value: 0 },
            { date: "2026-11-03", value: 120 },
          ]}
          formatValue={fmt}
          formatDate={day}
        />
      </>,
    );
    const bars = html.slice(html.indexOf("data-chart-bars"));
    expect(bars.match(/<path/g)).toHaveLength(2);
    expect(bars).toContain(`fill="${CHART_COLORS.bar}"`);
    for (const tick of [">0<", ">50<", ">100<", ">150<"]) {
      expect(html).toContain(tick);
    }
  });

  it("adds a pale previous-period bar where one exists", () => {
    const html = renderToStaticMarkup(
      <>
        <ChartBar
          ariaLabel="Views"
          label="This period"
          comparisonLabel="Previous period"
          data={[
            { date: "2026-11-01", value: 4, comparison: 2 },
            { date: "2026-11-02", value: 6, comparison: 3 },
          ]}
          formatValue={fmt}
          formatDate={day}
        />
      </>,
    );
    const bars = html.slice(
      html.indexOf("data-chart-bars"),
      html.indexOf("data-chart-x-axis"),
    );
    expect(bars.match(new RegExp(`fill="${CHART_COLORS.comparison}"`, "g"))).toHaveLength(
      2,
    );
    expect(html).toContain(">Previous period<");
  });
});

describe("ChartDonut", () => {
  it("rings the slices around the total, with each share in the legend", () => {
    const html = renderToStaticMarkup(
      <>
        <ChartDonut
          ariaLabel="Revenue by collection"
          total="$400.00"
          totalLabel="Total"
          slices={[
            { id: "a", label: "Shoes", value: 300, display: "$300.00" },
            { id: "b", label: "Hats", value: 100, display: "$100.00" },
          ]}
        />
      </>,
    );
    expect(html.match(/data-slice=/g)).toHaveLength(2);
    expect(html).toContain(">$400.00<");
    expect(html).toContain(">75%<");
    expect(html).toContain(">25%<");
  });
});

describe("ChartBarList", () => {
  it("scales each bar to the largest value", () => {
    const html = renderToStaticMarkup(
      <>
        <ChartBarList
          ariaLabel="Views by collection"
          items={[
            { id: "a", label: "Shoes", value: 200, display: "200" },
            { id: "b", label: "Hats", value: 50, display: "50", change: 12 },
          ]}
        />
      </>,
    );
    expect(html).toContain("width:100%");
    expect(html).toContain("width:25%");
    expect(html).toContain("↗ 12%");
  });
});

describe("ChartFunnel", () => {
  it("draws solid bars with faded drop-off bands between them", () => {
    const html = renderToStaticMarkup(
      <>
        <ChartFunnel
          ariaLabel="Conversion breakdown"
          stages={[
            {
              id: "a",
              label: "Sessions",
              value: 100,
              share: 100,
              shareDisplay: "100%",
              display: "100",
            },
            {
              id: "b",
              label: "Viewed",
              value: 40,
              share: 40,
              shareDisplay: "40%",
              display: "40",
            },
            {
              id: "c",
              label: "Orders",
              value: 4,
              share: 4,
              shareDisplay: "4%",
              display: "4",
              change: -5,
            },
          ]}
        />
      </>,
    );
    expect(html.match(/data-connector=/g)).toHaveLength(2);
    expect(html).toContain(">40%<");
    expect(html).toContain("↘ 5%");
    expect(html).toContain(`fill="${CHART_COLORS.bar}"`);
  });
});

describe("ChartSparkline", () => {
  it("draws a labelled trend line, nothing for no data", () => {
    const html = renderToStaticMarkup(
      <ChartSparkline values={[1, 3, 2]} ariaLabel="Revenue trend" />,
    );
    expect(html).toContain('aria-label="Revenue trend"');
    expect(html).toContain("<polyline");
    expect(renderToStaticMarkup(<ChartSparkline values={[]} ariaLabel="x" />)).toBe("");
  });
});

describe("ChartChange", () => {
  it("arrows up, down and flat, and nothing without a comparison", () => {
    expect(renderToStaticMarkup(<ChartChange pct={34} />)).toContain("↗ 34%");
    expect(renderToStaticMarkup(<ChartChange pct={-12.5} />)).toContain("↘ 12.5%");
    expect(renderToStaticMarkup(<ChartChange pct={0} />)).toContain("→ 0%");
    expect(renderToStaticMarkup(<ChartChange pct={null} />)).toBe("");
  });
});
