import type { DatePresetItemType, DateRangeType } from "./DatePicker.types";
import { parseISODate, toISODateString } from "./datePickerUtils";

/**
 * A Shopify-style relative date expression, e.g. `"today"`, `"yesterday"`,
 * `"startOfDay(-7d)"`, `"endOfMonth(-1m)"`, or `"date(11-27)"` (fixed month/day,
 * anchored to the reference year). Expressions are resolved to an ISO date
 * string only at read time — they are what gets stored, never the resolved date.
 */
export type DateExpressionType = string;

/** A semantic (unresolved) date range, following Shopify's `since`/`until` filter shape. */
export type SemanticDateRangeType = {
  since: DateExpressionType;
  until: DateExpressionType;
};

/**
 * A comparison-range rule. `"previous_period"` compares against the immediately
 * preceding period of equal length; `"previous_year"` shifts the same range back
 * one year; or supply an explicit semantic range for a custom comparison rule.
 */
export type ComparisonRuleType =
  "previous_period" | "previous_year" | SemanticDateRangeType;

/** A node in the reusable, semantic preset definition tree (mirrors Shopify date controls). */
export type DatePresetDefinitionType = {
  id: string;
  label: string;
  type: "dateRange";
  /** Omitted for group items (e.g. "Last", "Quarters") and for "custom", which stores absolute dates instead. */
  range?: SemanticDateRangeType;
  /** Optional default comparison rule for this preset. */
  comparison?: ComparisonRuleType;
  children?: DatePresetDefinitionType[];
  /** Renders a divider immediately before this item in its list. */
  divider?: boolean;
};

// ---------------------------------------------------------------------------
// Date arithmetic (month/quarter/year offsets clamp the day-of-month instead
// of overflowing, e.g. Mar 31 - 1 month -> Feb 28, matching date-fns behavior).
// ---------------------------------------------------------------------------

function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function addMonths(date: Date, amount: number): Date {
  const targetMonthIndex = date.getMonth() + amount;
  const year = date.getFullYear() + Math.floor(targetMonthIndex / 12);
  const month = ((targetMonthIndex % 12) + 12) % 12;
  const daysInTargetMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.min(date.getDate(), daysInTargetMonth);
  return new Date(year, month, day);
}

const addWeeks = (date: Date, amount: number): Date => addDays(date, amount * 7);
const addQuarters = (date: Date, amount: number): Date => addMonths(date, amount * 3);
const addYears = (date: Date, amount: number): Date => addMonths(date, amount * 12);

function startOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return addDays(date, -diffToMonday);
}
const endOfWeek = (date: Date): Date => addDays(startOfWeek(date), 6);
const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);
const startOfQuarter = (date: Date): Date => {
  const quarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), quarter * 3, 1);
};
const endOfQuarter = (date: Date): Date => {
  const quarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), quarter * 3 + 3, 0);
};
const startOfYear = (date: Date): Date => new Date(date.getFullYear(), 0, 1);
const endOfYear = (date: Date): Date => new Date(date.getFullYear(), 11, 31);

const OFFSET_UNIT_FNS: Record<string, (date: Date, amount: number) => Date> = {
  d: addDays,
  w: addWeeks,
  m: addMonths,
  q: addQuarters,
  y: addYears,
};

const BOUNDARY_FNS: Record<string, Record<string, (date: Date) => Date>> = {
  startOf: {
    Day: (d) => d,
    Week: startOfWeek,
    Month: startOfMonth,
    Quarter: startOfQuarter,
    Year: startOfYear,
  },
  endOf: {
    Day: (d) => d,
    Week: endOfWeek,
    Month: endOfMonth,
    Quarter: endOfQuarter,
    Year: endOfYear,
  },
};

const BOUNDARY_EXPR_PATTERN =
  /^(startOf|endOf)(Day|Week|Month|Quarter|Year)(?:\((-?\d+)([dwmqy])\))?$/;
const FIXED_DATE_PATTERN = /^date\((\d{2})-(\d{2})\)$/;

/** Resolves a single semantic date expression to an ISO date string (`"YYYY-MM-DD"`). */
export function resolveDateExpression(
  expr: DateExpressionType,
  referenceDate: Date = new Date(),
): string {
  const ref = new Date(referenceDate);

  if (expr === "today") return toISODateString(ref);
  if (expr === "yesterday") return toISODateString(addDays(ref, -1));

  const fixedMatch = expr.match(FIXED_DATE_PATTERN);
  if (fixedMatch) {
    const [, month, day] = fixedMatch;
    return toISODateString(new Date(ref.getFullYear(), Number(month) - 1, Number(day)));
  }

  const boundaryMatch = expr.match(BOUNDARY_EXPR_PATTERN);
  if (boundaryMatch) {
    const [, boundary, unit, offsetAmount, offsetUnit] = boundaryMatch;
    const base =
      offsetAmount && offsetUnit
        ? OFFSET_UNIT_FNS[offsetUnit]!(ref, Number(offsetAmount))
        : ref;
    return toISODateString(BOUNDARY_FNS[boundary!]![unit!]!(base));
  }

  throw new Error(`Unsupported date expression: "${expr}"`);
}

/** Resolves a semantic `{ since, until }` range to actual ISO dates. */
export function resolveSemanticRange(
  range: SemanticDateRangeType,
  referenceDate: Date = new Date(),
): DateRangeType {
  return {
    start: resolveDateExpression(range.since, referenceDate),
    end: resolveDateExpression(range.until, referenceDate),
  };
}

/** Resolves a comparison rule against an already-resolved current range. */
export function resolveComparisonRange(
  current: DateRangeType,
  rule: ComparisonRuleType,
  referenceDate: Date = new Date(),
): DateRangeType {
  if (typeof rule === "object") {
    return resolveSemanticRange(rule, referenceDate);
  }

  const start = parseISODate(current.start);
  const end = parseISODate(current.end);
  if (!start || !end) {
    throw new Error(
      `Cannot resolve comparison range: invalid current range ${JSON.stringify(current)}`,
    );
  }

  if (rule === "previous_year") {
    return {
      start: toISODateString(addYears(start, -1)),
      end: toISODateString(addYears(end, -1)),
    };
  }

  // previous_period: the immediately preceding period of equal length.
  const lengthInDays = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(lengthInDays - 1));
  return { start: toISODateString(previousStart), end: toISODateString(previousEnd) };
}

// ---------------------------------------------------------------------------
// Reusable preset definition tree — the single source of truth. Every built-in
// preset (Today, Yesterday, Last, Period to date, Black Friday / Cyber Monday,
// Quarters) is expressed as a semantic rule, never as a resolved date. Only
// "custom" carries no `range`, since a custom selection is inherently absolute.
// ---------------------------------------------------------------------------

export function getPresetDefinitions(): DatePresetDefinitionType[] {
  return [
    {
      id: "today",
      label: "Today",
      type: "dateRange",
      range: { since: "today", until: "today" },
      comparison: "previous_period",
    },
    {
      id: "yesterday",
      label: "Yesterday",
      type: "dateRange",
      range: { since: "yesterday", until: "yesterday" },
      comparison: "previous_period",
    },
    {
      id: "last",
      label: "Last",
      type: "dateRange",
      divider: true,
      children: [
        {
          id: "last_30_minutes",
          label: "Last 30 minutes",
          type: "dateRange",
          range: { since: "today", until: "today" },
        },
        {
          id: "last_12_hours",
          label: "Last 12 hours",
          type: "dateRange",
          range: { since: "today", until: "today" },
        },
        {
          id: "last_7_days",
          label: "Last 7 days",
          type: "dateRange",
          divider: true,
          range: { since: "startOfDay(-6d)", until: "today" },
          comparison: "previous_period",
        },
        {
          id: "last_30_days",
          label: "Last 30 days",
          type: "dateRange",
          range: { since: "startOfDay(-29d)", until: "today" },
          comparison: "previous_period",
        },
        {
          id: "last_90_days",
          label: "Last 90 days",
          type: "dateRange",
          range: { since: "startOfDay(-89d)", until: "today" },
          comparison: "previous_period",
        },
        {
          id: "last_365_days",
          label: "Last 365 days",
          type: "dateRange",
          range: { since: "startOfDay(-364d)", until: "today" },
          comparison: "previous_period",
        },
        {
          id: "last_week",
          label: "Last week",
          type: "dateRange",
          divider: true,
          range: { since: "startOfWeek(-1w)", until: "endOfWeek(-1w)" },
          comparison: "previous_period",
        },
        {
          id: "last_month",
          label: "Last month",
          type: "dateRange",
          range: { since: "startOfMonth(-1m)", until: "endOfMonth(-1m)" },
          comparison: "previous_period",
        },
        {
          id: "last_quarter",
          label: "Last quarter",
          type: "dateRange",
          range: { since: "startOfQuarter(-1q)", until: "endOfQuarter(-1q)" },
          comparison: "previous_period",
        },
        {
          id: "last_12_months",
          label: "Last 12 months",
          type: "dateRange",
          range: { since: "startOfDay(-12m)", until: "today" },
          comparison: "previous_year",
        },
        {
          id: "last_year",
          label: "Last year",
          type: "dateRange",
          range: { since: "startOfYear(-1y)", until: "endOfYear(-1y)" },
          comparison: "previous_year",
        },
      ],
    },
    {
      id: "period_to_date",
      label: "Period to date",
      type: "dateRange",
      children: [
        {
          id: "week_to_date",
          label: "Week to date",
          type: "dateRange",
          range: { since: "startOfWeek", until: "today" },
          comparison: "previous_period",
        },
        {
          id: "month_to_date",
          label: "Month to date",
          type: "dateRange",
          range: { since: "startOfMonth", until: "today" },
          comparison: "previous_period",
        },
        {
          id: "quarter_to_date",
          label: "Quarter to date",
          type: "dateRange",
          range: { since: "startOfQuarter", until: "today" },
          comparison: "previous_period",
        },
        {
          id: "year_to_date",
          label: "Year to date",
          type: "dateRange",
          range: { since: "startOfYear", until: "today" },
          comparison: "previous_year",
        },
      ],
    },
    {
      id: "bfcm",
      label: "Black Friday Cyber Monday",
      type: "dateRange",
      divider: true,
      range: { since: "date(11-27)", until: "date(11-30)" },
      comparison: "previous_year",
    },
    {
      id: "quarters",
      label: "Quarters",
      type: "dateRange",
      children: [
        {
          id: "q1",
          label: "Q1 " + new Date().getFullYear(),
          type: "dateRange",
          range: { since: "date(01-01)", until: "date(03-31)" },
        },
        {
          id: "q2",
          label: "Q2 " + new Date().getFullYear(),
          type: "dateRange",
          range: { since: "date(04-01)", until: "date(06-30)" },
        },
        {
          id: "q3",
          label: "Q3 " + new Date().getFullYear(),
          type: "dateRange",
          range: { since: "date(07-01)", until: "date(09-30)" },
        },
        {
          id: "q4",
          label: "Q4 " + new Date().getFullYear(),
          type: "dateRange",
          range: { since: "date(10-01)", until: "date(12-31)" },
        },
      ],
    },
    {
      id: "custom",
      label: "Custom range",
      type: "dateRange",
      divider: true,
    },
  ];
}

/** Flattens the (possibly nested) preset tree into a single list. */
export function flattenPresetDefinitions(
  defs: DatePresetDefinitionType[] = getPresetDefinitions(),
): DatePresetDefinitionType[] {
  return defs.flatMap((def) => [
    def,
    ...(def.children ? flattenPresetDefinitions(def.children) : []),
  ]);
}

/** Looks up a preset definition by id anywhere in the (possibly nested) tree. */
export function findPresetDefinitionById(
  id: string,
  defs: DatePresetDefinitionType[] = getPresetDefinitions(),
): DatePresetDefinitionType | undefined {
  return flattenPresetDefinitions(defs).find((def) => def.id === id);
}

/**
 * Resolves the semantic preset tree into the fully-resolved `DatePresetItemType[]`
 * shape the DatePicker UI already renders — resolution happens here, once, at
 * display time, so the tree itself never needs to store actual dates.
 */
export function resolvePresetDefinitions(
  defs: DatePresetDefinitionType[],
  referenceDate: Date = new Date(),
): DatePresetItemType[] {
  return defs.map((def) => ({
    id: def.id,
    label: def.label,
    divider: def.divider,
    range: def.range ? resolveSemanticRange(def.range, referenceDate) : undefined,
    children: def.children
      ? resolvePresetDefinitions(def.children, referenceDate)
      : undefined,
  }));
}

/** Resolves a single preset (by id) directly to a `DateRangeType`, at call time. */
export function resolvePresetRangeById(
  id: string,
  referenceDate: Date = new Date(),
): DateRangeType {
  const def = findPresetDefinitionById(id);
  if (!def?.range) {
    throw new Error(
      `Cannot resolve preset "${id}": it has no semantic range (is it a group or "custom"?)`,
    );
  }
  return resolveSemanticRange(def.range, referenceDate);
}

// ---------------------------------------------------------------------------
// Storage-facing filter value: what actually gets persisted (URL, localStorage,
// a saved report, ...). Relative presets are stored as an id and re-resolved
// every time they're read; only a genuine custom selection stores absolute dates.
// ---------------------------------------------------------------------------

export type DateFilterValueType =
  { type: "preset"; presetId: string } | { type: "custom"; range: DateRangeType };

/** Resolves a stored filter value to an actual `DateRangeType`, at read time. */
export function resolveDateFilterValue(
  value: DateFilterValueType,
  referenceDate: Date = new Date(),
): DateRangeType {
  return value.type === "custom"
    ? value.range
    : resolvePresetRangeById(value.presetId, referenceDate);
}

/**
 * Resolves the comparison range for a stored filter value. Presets use their own
 * `comparison` rule when defined; a custom range falls back to `"previous_period"`.
 */
export function resolveDateFilterComparison(
  value: DateFilterValueType,
  referenceDate: Date = new Date(),
): DateRangeType | undefined {
  const current = resolveDateFilterValue(value, referenceDate);
  const rule =
    value.type === "custom"
      ? "previous_period"
      : findPresetDefinitionById(value.presetId)?.comparison;
  return rule ? resolveComparisonRange(current, rule, referenceDate) : undefined;
}

/** Human-readable label for a stored filter value (for the preset case only). */
export function getPresetLabelById(id: string): string | undefined {
  return findPresetDefinitionById(id)?.label;
}
