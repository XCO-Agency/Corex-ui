# Analytics Charts (block)

Shopify admin analytics charts, drawn the way the native reports draw them: a blue current-period line with a pale dashed comparison line, light gridlines with a darker zero line, 12px grey axis labels, a white hover card, and a legend under each chart. Extracted from Rankify's analytics page, with the same styles.

```bash
npx @xco-agency/corex-ui@latest add analytics-charts
```

The CLI copies the block into `app/components/analytics-charts/` (or `src/components/…`, or the `componentsDir` in `corex.json`). It's your code after that, so you can change it. The only dependency is `@xco-agency/corex-ui`. There's no chart library.

Live example: [`/blocks/analytics-charts`](https://corex-ui.xco.agency/blocks/analytics-charts).

## What's in it

| Export              | What it draws                                                                                                                                |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChartCard`         | A Corex `Card` with the title (dotted underline, `definition` in its tooltip), the headline `value` with its change, and the chart under it. |
| `LineChart`         | One or more series over `dates`. `dashed: true` gives the comparison style.                                                                  |
| `ColumnChart`       | Bars per day, with an optional pale `comparison` bar beside each.                                                                            |
| `FunnelChart`       | Shopify's "Conversion rate breakdown": label, share, count and change per stage, then bars with faded drop-off bands.                        |
| `HorizontalBarList` | A ranked list ("Sessions by location"): label, a bar scaled to the largest value, the value and its change.                                  |
| `DonutChart`        | A ring of slices with the total in the centre, and a legend with each value and share. Hovering a legend row highlights its slice.           |
| `Sparkline`         | A small trend line with a light area, for table cells and metric cards.                                                                      |
| `ChangeIndicator`   | `↗ 34%` (success), `↘ 12%` (critical), `→ 0%` (subdued). Renders nothing for `null`.                                                         |

The block also exports its building pieces: `YAxisGrid`, `XAxisLabels`, `ChartTooltip`, `ChartLegend`, `SeriesMarker`, the hooks `useChartWidth` and `useActiveIndex`, the `CHART` palette, and these helpers:

- `axisTicks` / `valueScale`: round 0-based ticks of about four steps of 1, 2 or 5 × 10ⁿ.
- `xLabelIndexes`: the first, the last, and evenly spaced labels in between.
- `percentChange`: `null` when there's no previous value. It never makes one up.
- `dayRange`
- `periodSeries`: splits daily rows into the current period and the one before it, with gaps filled. The previous period is `null` when it has no data, so the chart doesn't draw a flat comparison line.
- `sum`

## Usage

```tsx
import {
  ChartCard,
  LineChart,
  percentChange,
  periodSeries,
  sum,
} from "~/components/analytics-charts";

const s = periodSeries(rows, { previousFrom, currentFrom, to }, (row) => row.sessions);

<ChartCard
  title={t("analytics.sessions")}
  definition={t("analytics.sessionsHelp")}
  value={formatNumber(sum(s.current))}
  change={percentChange(sum(s.current), s.previous && sum(s.previous))}
>
  <LineChart
    ariaLabel={t("analytics.sessionsChart")}
    dates={s.dates}
    formatValue={formatNumber}
    formatTick={formatCompact}
    formatDate={formatShortDate}
    series={[
      { id: "current", label: currentRangeLabel, values: s.current, dates: s.dates },
      ...(s.previous
        ? [
            {
              id: "previous",
              label: previousRangeLabel,
              values: s.previous,
              dates: s.previousDates,
              dashed: true,
            },
          ]
        : []),
    ]}
  />
</ChartCard>;
```

The block has no strings of its own. Every label, accessible name and number or date format comes in through props, so it works with any i18n setup and locale.

## Styles

All colours live in `constants.ts` (`CHART`), so retheming happens in one place.

| Token        | Value                                     | Used for                                     |
| :----------- | :---------------------------------------- | :------------------------------------------- |
| `primary`    | `#2c6ecb`                                 | Current-period line, sparkline               |
| `bar`        | `#4b8ff7`                                 | Columns, funnel stages, ranked bars          |
| `comparison` | `#a4c4f3`                                 | Previous-period line (dashed `5 4`) and bars |
| `faded`      | `#dbe8fd`                                 | Funnel tracks and drop-off bands             |
| `grid`       | `#ebebeb`                                 | Gridlines, empty donut ring                  |
| `baseline`   | `#d4d4d4`                                 | Zero line                                    |
| `axisText`   | `#616161` at 12px                         | Axis labels                                  |
| `guide`      | `#8a8a8a`                                 | Hover guide line (dashed `2 2`)              |
| `palette`    | `#2c6ecb #4b8ff7 #7fb0fa #b3d0fc #dbe8fd` | Donut slices                                 |

Columns have rounded top corners (2px). The hover card is 200px wide, white, with a 10px radius and a `0 4px 12px rgba(0,0,0,.12)` shadow. It flips to the left of the point near the right edge.

## Accessibility

- Line and column charts are focusable (`role="group"`, named by a `<title>`). With the chart focused, the arrow keys move between points, Home and End jump to the ends, and Escape hides the tooltip. A visually hidden live region reads out what the tooltip shows.
- The funnel, donut and sparkline are `role="img"` with an `aria-label`. Each funnel stage and donut slice also has its own `<title>`.
- The bar list is a `role="list"`, and each row's `aria-label` carries its label and value.
- Every value is also printed as text (the funnel header, the donut legend, the bar list), so nothing depends on hovering.

## Why it uses raw SVG

Corex blocks normally use only Corex components, and there are no inline styles. This block makes two exceptions, both kept as small as possible:

1. **The plots are `<svg>`.** Corex has no chart primitive, and drawing the plots in SVG is how the block avoids a chart dependency. All text outside the plot (titles, values, legends, the hover card's content, the funnel header, the bar list and donut legend) is Corex `Text`, laid out with `BlockStack`, `InlineStack`, `Grid`, `Box` and `Card`.
2. **Some geometry is set through `Box` `style`.** Examples are the hover card's position, the width of each ranked bar, and the donut's centre overlay. These are computed values that no Corex prop expresses.

## Tests

`apps/playground/src/blocks/analytics-charts/__tests__/charts.test.tsx` covers the scales, period splitting, line and column rendering, keyboard tooltips, the donut shares, the bar widths and the funnel connectors. Run it with `pnpm --filter playground test`. The registry builder leaves tests out of what the CLI copies.
