import type { CalendarViewType } from "../Calendar.types";
import { addDays, isSameDay } from "./date";

function format(date: Date, locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatTime(date: Date, locale?: string): string {
  return format(date, locale, {
    hour: "numeric",
    ...(date.getMinutes() === 0 ? {} : { minute: "2-digit" }),
  });
}

export function formatTimeRange(start: Date, end: Date, locale?: string): string {
  return `${formatTime(start, locale)} – ${formatTime(end, locale)}`;
}

export function formatWeekday(date: Date, locale?: string, width: "short" | "long" = "short") {
  return format(date, locale, { weekday: width });
}

export function formatFullDate(date: Date, locale?: string): string {
  return format(date, locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

/** Hour label for the time-grid gutter, e.g. "9 AM". */
export function formatHour(minutes: number, locale?: string): string {
  const date = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);
  return format(date, locale, { hour: "numeric", ...(minutes % 60 ? { minute: "2-digit" } : {}) });
}

/** "October 2026", "Oct 19 – 25, 2026", or "Monday, October 19, 2026". */
export function formatTitle(
  view: CalendarViewType,
  date: Date,
  rangeStart: Date,
  rangeEndExclusive: Date,
  locale?: string,
): string {
  if (view === "month" || view === "list") {
    return format(date, locale, { month: "long", year: "numeric" });
  }
  if (view === "day") {
    return format(date, locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  const last = addDays(rangeEndExclusive, -1);
  if (isSameDay(rangeStart, last)) return formatFullDate(rangeStart, locale);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const formatter = new Intl.DateTimeFormat(locale, options) as Intl.DateTimeFormat & {
    formatRange?: (start: Date, end: Date) => string;
  };
  if (typeof formatter.formatRange === "function") return formatter.formatRange(rangeStart, last);
  return `${formatter.format(rangeStart)} – ${formatter.format(last)}`;
}
