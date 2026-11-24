import {
  BlockStack,
  ChartBar,
  ChartBarList,
  ChartDonut,
  ChartFunnel,
  ChartLine,
  ChartSparkline,
  Grid,
  Page,
} from "@xco-agency/corex-ui";
import { ChartCard } from "../partials/ChartCard";
import { percentChange, sum } from "../utils";
import {
  FUNNEL_STAGES,
  ORDERS_14,
  SALES,
  SALES_BY_CHANNEL,
  SESSIONS,
  TOP_LOCATIONS,
} from "./sampleData";

// All copy and formatting is passed in: swap these for your i18n and locale.
const number = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const shortDate = (iso: string) =>
  iso
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";
const rangeLabel = (dates: string[]) =>
  dates.length
    ? `${shortDate(dates[0] ?? "")} – ${shortDate(dates[dates.length - 1] ?? "")}`
    : "";

export function AnalyticsChartsExample() {
  const sessionsTotal = sum(SESSIONS.current);
  const sessionsPrevious = SESSIONS.previous ? sum(SESSIONS.previous) : null;
  const salesTotal = sum(SALES.current);
  const salesPrevious = SALES.previous ? sum(SALES.previous) : null;
  const ordersTotal = sum(ORDERS_14.current);
  const ordersPrevious = ORDERS_14.previous ? sum(ORDERS_14.previous) : null;

  return (
    <Page heading="Analytics">
      <BlockStack gap="base">
        <Grid columns={{ xs: 1, md: 2 }} gap="base">
          <ChartCard
            title="Sessions"
            definition="Visits to your online store in the selected period."
            value={number.format(sessionsTotal)}
            change={percentChange(sessionsTotal, sessionsPrevious)}
          >
            <ChartLine
              ariaLabel={`Sessions, ${rangeLabel(SESSIONS.dates)}`}
              dates={SESSIONS.dates}
              formatValue={(n) => number.format(n)}
              formatTick={(n) => compact.format(n)}
              formatDate={shortDate}
              series={[
                {
                  id: "current",
                  label: rangeLabel(SESSIONS.dates),
                  values: SESSIONS.current,
                  dates: SESSIONS.dates,
                },
                ...(SESSIONS.previous
                  ? [
                      {
                        id: "previous",
                        label: rangeLabel(SESSIONS.previousDates),
                        values: SESSIONS.previous,
                        dates: SESSIONS.previousDates,
                        dashed: true,
                      },
                    ]
                  : []),
              ]}
            />
          </ChartCard>

          <ChartCard
            title="Orders"
            definition="Orders placed per day, against the two weeks before."
            value={number.format(ordersTotal)}
            change={percentChange(ordersTotal, ordersPrevious)}
          >
            <ChartBar
              ariaLabel={`Orders per day, ${rangeLabel(ORDERS_14.dates)}`}
              label={rangeLabel(ORDERS_14.dates)}
              comparisonLabel={rangeLabel(ORDERS_14.previousDates)}
              comparisonDates={ORDERS_14.previousDates}
              data={ORDERS_14.dates.map((date, i) => ({
                date,
                value: ORDERS_14.current[i] ?? 0,
                comparison: ORDERS_14.previous?.[i],
              }))}
              formatValue={(n) => number.format(n)}
              formatDate={shortDate}
            />
          </ChartCard>
        </Grid>

        <ChartCard
          title="Conversion rate breakdown"
          definition="How many sessions reached each step of the purchase."
          value="3.2%"
          change={0.4}
        >
          <ChartFunnel ariaLabel="Conversion rate breakdown" stages={FUNNEL_STAGES} />
        </ChartCard>

        <Grid columns={{ xs: 1, md: 3 }} gap="base">
          <ChartCard
            title="Sessions by location"
            definition="Top countries by sessions in the selected period."
          >
            <ChartBarList ariaLabel="Sessions by location" items={TOP_LOCATIONS} />
          </ChartCard>

          <ChartCard
            title="Sales by channel"
            definition="Gross sales split by the channel the order came from."
          >
            <ChartDonut
              ariaLabel="Sales by channel"
              total={money.format(sum(SALES_BY_CHANNEL.map((s) => s.value)))}
              totalLabel="Total"
              slices={SALES_BY_CHANNEL}
            />
          </ChartCard>

          <ChartCard
            title="Total sales"
            definition="Gross sales minus discounts and returns."
            value={money.format(salesTotal)}
            change={percentChange(salesTotal, salesPrevious)}
          >
            <ChartSparkline
              ariaLabel="Total sales trend"
              values={SALES.current}
              width={240}
              height={48}
            />
          </ChartCard>
        </Grid>
      </BlockStack>
    </Page>
  );
}
