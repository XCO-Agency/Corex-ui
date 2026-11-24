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
import { ChartTooltip } from "./ChartTooltip";
import { ChartSparkline } from "./ChartSparkline";
import { CHART_COLORS } from "./Chart.constants";
import {
  chartAxisTicks,
  chartLabelIndexes,
  chartLinePath,
  chartValueScale,
} from "./Chart.utils";

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
    expect(html).toContain(">80%<");
    expect(html).toContain(">20%<");
  });

  it("shares against a given total instead of the listed rows", () => {
    const html = renderToStaticMarkup(
      <ChartBarList
        ariaLabel="x"
        total={1000}
        items={[{ id: "a", label: "Shoes", value: 200, display: "200" }]}
      />,
    );
    expect(html).toContain(">20%<");
  });
});

describe("ChartBarList hover", () => {
  let host: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it("darkens the hovered row, dims the others and opens its card", () => {
    act(() =>
      root.render(
        <ChartBarList
          ariaLabel="Views"
          items={[
            { id: "a", label: "Shoes", value: 200, display: "200" },
            { id: "b", label: "Hats", value: 50, display: "50", change: 12 },
          ]}
        />,
      ),
    );
    const row = (id: string) => host.querySelector(`[data-row="${id}"]`) as HTMLElement;
    // Box puts its style on a wrapper around the s-box that takes the events.
    const wrap = (id: string) => row(id).parentElement as HTMLElement;
    act(() => {
      row("b").dispatchEvent(new MouseEvent("mouseenter"));
    });
    expect(wrap("a").style.opacity).toBe("0.45");
    expect(wrap("b").style.opacity).toBe("1");
    const card = host.querySelector("[data-chart-tooltip]")?.textContent ?? "";
    expect(card).toContain("Hats");
    expect(card).toContain("50");
    expect(card).toContain("↗ 12%");
    act(() => {
      row("b").dispatchEvent(new MouseEvent("mouseleave"));
    });
    expect(host.querySelector("[data-chart-tooltip]")).toBeNull();
  });

  it("keeps rows to the share and prints value and change only without the card", () => {
    const items = [{ id: "a", label: "Shoes", value: 200, display: "1,200", change: 12 }];
    const compact = renderToStaticMarkup(<ChartBarList ariaLabel="x" items={items} />);
    expect(compact).toContain(">100%<");
    expect(compact).not.toContain(">1,200<");
    expect(compact).not.toContain("↗ 12%");
    const inline = renderToStaticMarkup(
      <ChartBarList ariaLabel="x" items={items} tooltip={false} />,
    );
    expect(inline).toContain(">1,200<");
    expect(inline).toContain("↗ 12%");
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
  it("draws a labelled trend line, decorative without a label, nothing for fewer than two values", () => {
    const html = renderToStaticMarkup(
      <ChartSparkline values={[1, 3, 2]} ariaLabel="Revenue trend" />,
    );
    expect(html).toContain('aria-label="Revenue trend"');
    expect(html).toContain('role="img"');
    expect(renderToStaticMarkup(<ChartSparkline values={[1, 3, 2]} />)).toContain(
      'aria-hidden="true"',
    );
    expect(renderToStaticMarkup(<ChartSparkline values={[5]} ariaLabel="x" />)).toBe("");
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

describe("ChartDonut hover", () => {
  let host: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it("grows the hovered slice, dims the others and shows its tooltip", () => {
    act(() =>
      root.render(
        <ChartDonut
          ariaLabel="Revenue by collection"
          total="$400.00"
          totalLabel="Total"
          slices={[
            { id: "a", label: "Shoes", value: 300, display: "$300.00" },
            { id: "b", label: "Hats", value: 100, display: "$100.00" },
          ]}
        />,
      ),
    );
    const slice = (id: string) => host.querySelector(`[data-slice="${id}"]`)!;
    expect(slice("a").getAttribute("stroke-opacity")).toBe("1");
    act(() => {
      slice("b").dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
    expect(Number(slice("b").getAttribute("stroke-width"))).toBeGreaterThan(
      Number(slice("a").getAttribute("stroke-width")),
    );
    expect(slice("b").getAttribute("stroke-opacity")).toBe("1");
    expect(slice("a").getAttribute("stroke-opacity")).toBe("0.3");
    expect(host.querySelector("[data-chart-tooltip]")?.textContent).toContain("25%");
    expect(host.textContent).toContain("Hats");
    act(() => {
      slice("b").dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });
    expect(host.querySelector("[data-chart-tooltip]")).toBeNull();
    expect(slice("a").getAttribute("stroke-opacity")).toBe("1");
  });
});

describe("ChartFunnel hover", () => {
  let host: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const stages = [
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
      label: "Orders",
      value: 4,
      share: 4,
      shareDisplay: "4%",
      display: "4",
      note: "4% of the previous step",
      change: 12,
      details: [{ label: "Drop-off", value: "−96%" }],
    },
  ];

  it("highlights the hovered stage, dims the rest and opens its card", () => {
    act(() =>
      root.render(<ChartFunnel ariaLabel="Conversion breakdown" stages={stages} />),
    );
    const group = (id: string) =>
      host.querySelector(`[data-stage="${id}"]`) as SVGElement;
    expect(host.querySelector("[data-chart-tooltip]")).toBeNull();
    act(() => {
      host
        .querySelector('[data-stage-hit="b"]')!
        .dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
    expect(group("a").style.opacity).toBe("0.45");
    expect(group("b").style.opacity).toBe("1");
    const card = host.querySelector("[data-chart-tooltip]")?.textContent ?? "";
    expect(card).toContain("Orders");
    expect(card).toContain("Drop-off");
    expect(card).toContain("−96%");
    expect(card).toContain("4% of the previous step");
    expect(card).toContain("↗ 12%");
    act(() => {
      host
        .querySelector('[data-stage-hit="b"]')!
        .dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });
    expect(host.querySelector("[data-chart-tooltip]")).toBeNull();
    expect(group("a").style.opacity).toBe("1");
  });

  it("opens the card from the stage header too", () => {
    act(() =>
      root.render(<ChartFunnel ariaLabel="Conversion breakdown" stages={stages} />),
    );
    act(() => {
      host
        .querySelector('[data-stage-header="a"]')!
        .dispatchEvent(new MouseEvent("mouseenter"));
    });
    expect(host.querySelector("[data-chart-tooltip]")?.textContent).toContain("Sessions");
  });
});

describe("ChartTooltip placement", () => {
  const rows = [{ color: "#000", label: "a", value: "1" }];
  it("clears the hovered element instead of covering it", () => {
    // A 40px column centred at 100: the card starts past its right edge (120 + 12).
    expect(
      renderToStaticMarkup(
        <ChartTooltip x={100} anchorWidth={40} containerWidth={600} rows={rows} />,
      ),
    ).toContain("left:132px");
    // No room on the right: it goes left of the column and stays inside the container.
    expect(
      renderToStaticMarkup(
        <ChartTooltip x={500} anchorWidth={40} containerWidth={600} rows={rows} />,
      ),
    ).toContain("left:268px");
  });

  it("sits outside the box above or below, not over it", () => {
    const below = renderToStaticMarkup(
      <ChartTooltip x={0} containerWidth={600} rows={rows} placement="below" />,
    );
    expect(below).toContain("top:calc(100% + 4px)");
    const above = renderToStaticMarkup(
      <ChartTooltip x={0} containerWidth={600} rows={rows} placement="above" />,
    );
    expect(above).toContain("bottom:calc(100% + 4px)");
  });
});

describe("line curve", () => {
  const pts = [
    { x: 0, y: 100 },
    { x: 10, y: 20 },
    { x: 20, y: 20 },
    { x: 30, y: 80 },
  ];
  it("joins points with straight segments when sharp", () => {
    expect(chartLinePath(pts, "sharp")).toBe(
      "M0.0,100.0 L10.0,20.0 L20.0,20.0 L30.0,80.0",
    );
  });

  it("curves through every point without overshooting, by default", () => {
    const d = chartLinePath(pts);
    expect(d).toBe(chartLinePath(pts, "smooth"));
    expect(d.match(/C/g)).toHaveLength(3);
    expect(d).toContain("10.0,20.0");
    // Flat between two equal points: the control points stay on that level (no dip below 20).
    const flat = d.split(" C")[2]!;
    expect(flat.match(/,20\.0/g)!.length).toBeGreaterThanOrEqual(3);
  });

  it("draws the line smooth unless asked for sharp", () => {
    const line = (curve?: "smooth" | "sharp") =>
      renderToStaticMarkup(
        <ChartLine
          ariaLabel="x"
          dates={["a", "b", "c"]}
          formatValue={fmt}
          formatDate={day}
          curve={curve}
          series={[{ id: "current", label: "Now", values: [1, 5, 2] }]}
        />,
      );
    expect(line()).toMatch(/<path data-series="current" d="M[^"]* C/);
    expect(line("sharp")).not.toMatch(/data-series="current" d="[^"]*C/);
  });
});
