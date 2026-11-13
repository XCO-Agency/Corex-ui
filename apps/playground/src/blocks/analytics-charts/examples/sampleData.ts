import type { BarListItemType, DonutSliceType, FunnelStageType } from "../types";
import { dayRange, periodSeries } from "../utils";

/** Deterministic demo rows: 60 days of sessions, orders and sales. */
const ALL_DAYS = dayRange("2026-09-15", "2026-11-13");

export const DAILY_ROWS = ALL_DAYS.map((date, i) => {
  // Seeded noise plus a weekly rhythm, so the demo looks like real traffic.
  const noise = ((i * 9301 + 49297) % 233280) / 233280 - 0.5;
  const weekly = [0.92, 1, 1.04, 1.02, 1.08, 1.18, 0.96][i % 7] ?? 1;
  const growth = 1 + i / 90;
  const sessions = Math.round(420 * growth * weekly * (1 + noise * 0.35));
  const orders = Math.round(sessions * (0.026 + (noise + 0.5) * 0.012));
  return { date, sessions, orders, sales: orders * 46 };
});

export const RANGE = {
  previousFrom: "2026-09-15",
  currentFrom: "2026-10-15",
  to: "2026-11-13",
};

export const SESSIONS = periodSeries(DAILY_ROWS, RANGE, (row) => row.sessions);
export const SALES = periodSeries(DAILY_ROWS, RANGE, (row) => row.sales);

/** The last two weeks of orders, with the two weeks before as comparison. */
export const ORDERS_14 = periodSeries(
  DAILY_ROWS,
  { previousFrom: "2026-10-17", currentFrom: "2026-10-31", to: "2026-11-13" },
  (row) => row.orders,
);

export const FUNNEL_STAGES: FunnelStageType[] = [
  {
    id: "sessions",
    label: "Sessions",
    help: "Visits to the online store.",
    value: 15840,
    share: 100,
    shareDisplay: "100%",
    display: "15,840",
    change: 8.2,
  },
  {
    id: "cart",
    label: "Added to cart",
    help: "Sessions where a product was added to the cart.",
    value: 1426,
    share: 9,
    shareDisplay: "9%",
    display: "1,426",
    note: "9% of the previous step",
    change: 3.1,
  },
  {
    id: "checkout",
    label: "Reached checkout",
    help: "Sessions that reached the checkout page.",
    value: 792,
    share: 5,
    shareDisplay: "5%",
    display: "792",
    note: "55.5% of the previous step",
    change: -1.4,
  },
  {
    id: "converted",
    label: "Converted",
    help: "Sessions that ended in an order.",
    value: 507,
    share: 3.2,
    shareDisplay: "3.2%",
    display: "507",
    note: "64% of the previous step",
    change: 0,
  },
];

export const TOP_LOCATIONS: BarListItemType[] = [
  { id: "us", label: "United States", value: 6420, display: "6,420", change: 12.4 },
  { id: "ca", label: "Canada", value: 2310, display: "2,310", change: 4.8 },
  { id: "gb", label: "United Kingdom", value: 1875, display: "1,875", change: -3.2 },
  { id: "fr", label: "France", value: 1120, display: "1,120", change: 21 },
  { id: "ma", label: "Morocco", value: 640, display: "640", change: null },
];

export const SALES_BY_CHANNEL: DonutSliceType[] = [
  { id: "online", label: "Online Store", value: 18420, display: "$18,420" },
  { id: "pos", label: "Point of Sale", value: 6210, display: "$6,210" },
  { id: "shop", label: "Shop app", value: 3150, display: "$3,150" },
  { id: "social", label: "Social", value: 1240, display: "$1,240" },
];
