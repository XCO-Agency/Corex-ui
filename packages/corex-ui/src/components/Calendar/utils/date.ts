const DAY_MS = 86_400_000;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Calendar-day arithmetic: stays on local midnight across DST changes. */
export function addDays(date: Date, amount: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + amount);
  return next;
}

/** Clamps the day so Jan 31 + 1 month is Feb 28/29, not March 3. */
export function addMonths(date: Date, amount: number): Date {
  const next = new Date(date.getTime());
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + amount);
  next.setDate(Math.min(day, daysInMonth(next.getFullYear(), next.getMonth())));
  return next;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfWeek(date: Date, firstDay: number): Date {
  const offset = (date.getDay() - firstDay + 7) % 7;
  return addDays(startOfDay(date), -offset);
}

export function endOfWeek(date: Date, firstDay: number): Date {
  return addDays(startOfWeek(date, firstDay), 6);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Whole calendar days from `a` to `b` (DST-safe). */
export function diffDays(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / DAY_MS);
}

export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Local date at `minutes` after midnight of `day` (DST-safe via setHours). */
export function atMinutes(day: Date, minutes: number): Date {
  const next = startOfDay(day);
  next.setHours(Math.floor(minutes / 60), Math.round(minutes % 60), 0, 0);
  return next;
}

/** `"HH:mm"` (or `"24:00"`) to minutes after midnight. Invalid input yields `fallback`. */
export function parseTimeToMinutes(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return fallback;
  const total = Number(match[1]) * 60 + Number(match[2]);
  return total >= 0 && total <= 24 * 60 ? total : fallback;
}

export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Parses `Date | string`. Date-only strings are local midnight, not UTC. */
export function parseDateInput(value: Date | string): Date {
  if (value instanceof Date) return new Date(value.getTime());
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }
  return new Date(value);
}

export function fromDateKey(key: string): Date {
  return parseDateInput(key);
}

/** ISO-8601 week number (weeks start Monday; week 1 holds the first Thursday). */
export function getISOWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = Date.UTC(target.getUTCFullYear(), 0, 1);
  return Math.ceil(((target.getTime() - yearStart) / DAY_MS + 1) / 7);
}

/**
 * Weeks of days covering `date`'s month. With `fixedWeekCount` the grid
 * always has six weeks so the layout never jumps between months.
 */
export function getMonthGrid(
  date: Date,
  firstDay: number,
  fixedWeekCount = true,
): Date[][] {
  const first = startOfMonth(date);
  const gridStart = startOfWeek(first, firstDay);
  const lastDay = endOfMonth(date);
  const weekCount = fixedWeekCount
    ? 6
    : Math.ceil((diffDays(gridStart, lastDay) + 1) / 7);
  const weeks: Date[][] = [];
  for (let week = 0; week < weekCount; week += 1) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day += 1) {
      row.push(addDays(gridStart, week * 7 + day));
    }
    weeks.push(row);
  }
  return weeks;
}

export function getWeekDays(date: Date, firstDay: number): Date[] {
  const start = startOfWeek(date, firstDay);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
