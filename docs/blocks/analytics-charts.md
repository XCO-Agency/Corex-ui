# Analytics Charts (block)

Shopify admin analytics charts, drawn the way the native reports draw them: a blue current-period line with a pale dashed comparison line, light gridlines with a darker zero line, 12px grey axis labels, a white hover card, and a legend under each chart. Extracted from Rankify's analytics page, with the same styles.

```bash
npx @xco-agency/corex-ui@latest add analytics-charts
```

The CLI copies the example page, `ChartCard`, `ChangeIndicator` and the period helpers into `app/components/analytics-charts/` (or `src/components/…`, or the `componentsDir` in `corex.json`). It's your code after that. The charts themselves are components of `@xco-agency/corex-ui`, so the block imports them. There's no chart library.

Live example: [`/blocks/analytics-charts`](https://corex-ui.xco.agency/blocks/analytics-charts).

## Chart components (in `@xco-agency/corex-ui`)

Source: `packages/corex-ui/src/components/Chart/`. The package ships only the charts, with no card or title around them, so you can place them anywhere.

| Export           | What it draws                                                                                                                                                                                                                                                    |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChartLine`      | One or more series over `dates`. `dashed: true` gives the comparison style. `curve` is `"smooth"` (default, a curve through every point that never overshoots) or `"sharp"` (straight segments).                                                                 |
| `ChartBar`       | Bars per day, with an optional pale `comparison` bar beside each.                                                                                                                                                                                                |
| `ChartFunnel`    | Shopify's "Conversion rate breakdown": label, share, count and change per stage, then bars with faded drop-off bands.                                                                                                                                            |
| `ChartBarList`   | A ranked list ("Sessions by location"): the label (and an optional `leading` flag or icon), its share of `total` and a thin bar scaled to the largest value. The value and change are in a compact hover card; `tooltip={false}` prints them in the row instead. |
| `ChartDonut`     | A ring of slices with the total in the centre, and a legend with each value and share. Hovering a legend row highlights its slice.                                                                                                                               |
| `ChartSparkline` | A small trend line with a light area, for table cells and metric cards.                                                                                                                                                                                          |

`CHART_COLORS` (the palette) and each chart's prop types are exported too.

## What the block adds

- `partials/ChartCard.tsx`: a Corex `Card` that passes `heading`, `tooltip` and `actions` straight to the Card (its own title, dotted-underline definition and header actions), then shows the headline `value` with its change and the chart under it.
- `partials/ChangeIndicator.tsx`: `↗ 34%` (success), `↘ 12%` (critical), `→ 0%` (subdued). Renders nothing for `null`.
- `utils.ts`: `percentChange` (`null` without a previous value, never invented), `dayRange`, `periodSeries` (splits daily rows into the current and previous period; the previous is `null` when it has no data, so no flat comparison line is drawn) and `sum`.

## Usage

```tsx
import { ChartLine } from "@xco-agency/corex-ui";
import { ChartCard } from "~/components/analytics-charts/partials/ChartCard";
import { percentChange, periodSeries, sum } from "~/components/analytics-charts/utils";

const s = periodSeries(rows, { previousFrom, currentFrom, to }, (row) => row.sessions);

<ChartCard
  heading={t("analytics.sessions")}
  tooltip={t("analytics.sessionsHelp")}
  value={formatNumber(sum(s.current))}
  change={percentChange(sum(s.current), s.previous && sum(s.previous))}
>
  <ChartLine
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

The charts have no strings of their own. Every label, accessible name and number or date format comes in through props, so they work with any i18n setup and locale.

## Styles

Colours are the `CHART_COLORS` palette in the package.

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

Blocks use only Corex components. The chart components inside the package make two exceptions, both kept as small as possible:

1. **The plots are `<svg>`.** Corex has no chart primitive, and drawing the plots in SVG is how the block avoids a chart dependency. All text outside the plot (titles, values, legends, the hover card's content, the funnel header, the bar list and donut legend) is Corex `Text`, laid out with `BlockStack`, `InlineStack`, `Grid`, `Box` and `Card`.
2. **Some geometry is set through `Box` `style`.** Examples are the hover card's position, the width of each ranked bar, and the donut's centre overlay. These are computed values that no Corex prop expresses.

## Tests

`packages/corex-ui/src/components/Chart/Chart.test.tsx` covers the scales, line and bar rendering, keyboard tooltips, the donut shares, the bar widths and the funnel connectors (`pnpm --filter @xco-agency/corex-ui test`). The block's own helpers and card are covered by `apps/playground/src/blocks/analytics-charts/__tests__/block.test.tsx` (`pnpm --filter playground test`).
