import type { CalendarEventType, CalendarRangeType } from "../Calendar.types";
import { addDays, addMonths, daysInMonth, parseDateInput, startOfDay } from "./date";

const WEEKDAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const MAX_ITERATIONS = 5000;

type RuleType = {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval: number;
  count?: number;
  until?: Date;
  byDay?: number[];
};

export function parseRRule(rrule: string): RuleType | null {
  const parts = new Map<string, string>();
  for (const part of rrule.replace(/^RRULE:/i, "").split(";")) {
    const [key, value] = part.split("=");
    if (key && value) parts.set(key.trim().toUpperCase(), value.trim());
  }
  const freq = parts.get("FREQ")?.toUpperCase();
  if (freq !== "DAILY" && freq !== "WEEKLY" && freq !== "MONTHLY" && freq !== "YEARLY") {
    return null;
  }
  const interval = Math.max(1, Number(parts.get("INTERVAL") ?? 1) || 1);
  const countRaw = parts.get("COUNT");
  const untilRaw = parts.get("UNTIL");
  const byDayRaw = parts.get("BYDAY");

  let until: Date | undefined;
  if (untilRaw) {
    const compact = /^(\d{4})(\d{2})(\d{2})/.exec(untilRaw);
    until = compact
      ? new Date(Number(compact[1]), Number(compact[2]) - 1, Number(compact[3]), 23, 59, 59)
      : parseDateInput(untilRaw);
  }

  const byDay = byDayRaw
    ?.split(",")
    .map((code) => WEEKDAY_CODES.indexOf(code.trim().toUpperCase().slice(-2)))
    .filter((index) => index >= 0);

  return {
    freq,
    interval,
    count: countRaw ? Number(countRaw) : undefined,
    until,
    byDay: byDay && byDay.length > 0 ? byDay : undefined,
  };
}

function withTimeOf(day: Date, source: Date): Date {
  const next = new Date(day.getTime());
  next.setHours(source.getHours(), source.getMinutes(), source.getSeconds(), 0);
  return next;
}

/**
 * Start dates of every occurrence of a recurring event that may touch
 * `range`. Supports FREQ (DAILY, WEEKLY, MONTHLY, YEARLY), INTERVAL, COUNT,
 * UNTIL and BYDAY (weekly). `durationDays` widens the window so multi-day
 * occurrences that began before the range are still found.
 */
export function expandRecurrence(
  event: CalendarEventType,
  range: CalendarRangeType,
  durationDays = 1,
): Date[] {
  if (!event.rrule) return [];
  const rule = parseRRule(event.rrule);
  if (!rule) return [];

  const dtstart = parseDateInput(event.start);
  if (Number.isNaN(dtstart.getTime())) return [];

  const windowStart = addDays(range.start, -Math.max(0, durationDays - 1));
  const results: Date[] = [];
  let produced = 0;
  let iterations = 0;

  const accept = (candidate: Date): "continue" | "stop" => {
    if (candidate < dtstart) return "continue";
    if (rule.until && candidate > rule.until) return "stop";
    produced += 1;
    if (rule.count !== undefined && produced > rule.count) return "stop";
    if (candidate >= range.end) return "stop";
    if (candidate >= windowStart) results.push(candidate);
    return "continue";
  };

  if (rule.freq === "DAILY") {
    for (let step = 0; iterations < MAX_ITERATIONS; step += rule.interval, iterations += 1) {
      if (accept(withTimeOf(addDays(startOfDay(dtstart), step), dtstart)) === "stop") break;
    }
  } else if (rule.freq === "WEEKLY") {
    const days = [...(rule.byDay ?? [dtstart.getDay()])].sort((a, b) => a - b);
    // RFC 5545 default week start is Monday.
    const weekStart = addDays(startOfDay(dtstart), -((dtstart.getDay() + 6) % 7));
    outer: for (let week = 0; iterations < MAX_ITERATIONS; week += rule.interval, iterations += 1) {
      const base = addDays(weekStart, week * 7);
      const ordered = [...days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
      for (const weekday of ordered) {
        const day = addDays(base, (weekday + 6) % 7);
        if (accept(withTimeOf(day, dtstart)) === "stop") break outer;
      }
    }
  } else if (rule.freq === "MONTHLY") {
    for (let step = 0; iterations < MAX_ITERATIONS; step += rule.interval, iterations += 1) {
      const target = addMonths(new Date(dtstart.getFullYear(), dtstart.getMonth(), 1), step);
      // Months too short for the day-of-month are skipped, per RFC 5545.
      if (dtstart.getDate() > daysInMonth(target.getFullYear(), target.getMonth())) continue;
      target.setDate(dtstart.getDate());
      if (accept(withTimeOf(target, dtstart)) === "stop") break;
    }
  } else {
    for (let step = 0; iterations < MAX_ITERATIONS; step += rule.interval, iterations += 1) {
      const target = new Date(dtstart.getFullYear() + step, dtstart.getMonth(), dtstart.getDate());
      if (target.getMonth() !== dtstart.getMonth()) continue; // Feb 29 on a non-leap year
      if (accept(withTimeOf(target, dtstart)) === "stop") break;
    }
  }

  return results;
}
