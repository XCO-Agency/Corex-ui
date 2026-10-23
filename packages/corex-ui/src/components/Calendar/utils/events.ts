import type {
  CalendarEventType,
  CalendarOccurrenceType,
  CalendarRangeType,
} from "../Calendar.types";
import { addDays, diffDays, parseDateInput, startOfDay } from "./date";
import { expandRecurrence } from "./recurrence";

const HOUR_MS = 3_600_000;

/**
 * Resolves events into concrete occurrences overlapping `range`. All-day
 * occurrences snap to local midnights with an exclusive end; timed ones keep
 * their exact instants. Invalid dates are dropped.
 */
export function resolveOccurrences(
  events: CalendarEventType[],
  range: CalendarRangeType,
): CalendarOccurrenceType[] {
  const occurrences: CalendarOccurrenceType[] = [];

  for (const event of events) {
    const rawStart = parseDateInput(event.start);
    if (Number.isNaN(rawStart.getTime())) continue;
    const allDay = Boolean(event.allDay);

    let start: Date;
    let end: Date;
    if (allDay) {
      start = startOfDay(rawStart);
      const rawEnd = event.end ? parseDateInput(event.end) : null;
      if (rawEnd && !Number.isNaN(rawEnd.getTime())) {
        end = startOfDay(rawEnd);
        if (end.getTime() !== rawEnd.getTime()) end = addDays(end, 1);
      } else {
        end = addDays(start, 1);
      }
      if (end <= start) end = addDays(start, 1);
    } else {
      start = rawStart;
      const rawEnd = event.end ? parseDateInput(event.end) : null;
      end =
        rawEnd && !Number.isNaN(rawEnd.getTime())
          ? rawEnd
          : new Date(start.getTime() + HOUR_MS);
      if (end <= start) end = new Date(start.getTime() + HOUR_MS);
    }

    if (event.rrule) {
      const durationMs = end.getTime() - start.getTime();
      const spanDays = allDay ? diffDays(start, end) : Math.ceil(durationMs / 86_400_000);
      for (const occurrenceStart of expandRecurrence(event, range, spanDays)) {
        const occStart = allDay ? startOfDay(occurrenceStart) : occurrenceStart;
        const occEnd = allDay
          ? addDays(occStart, spanDays)
          : new Date(occStart.getTime() + durationMs);
        if (occStart < range.end && occEnd > range.start) {
          occurrences.push({
            key: `${event.id}:${occStart.getTime()}`,
            event,
            start: occStart,
            end: occEnd,
            allDay,
          });
        }
      }
      continue;
    }

    if (start < range.end && end > range.start) {
      occurrences.push({ key: `${event.id}:${start.getTime()}`, event, start, end, allDay });
    }
  }

  return occurrences;
}

export function isMultiDay(occurrence: CalendarOccurrenceType): boolean {
  if (occurrence.allDay) return diffDays(occurrence.start, occurrence.end) > 1;
  // A timed event ending exactly at midnight still belongs to the previous day.
  const lastInstant = new Date(occurrence.end.getTime() - 1);
  return diffDays(occurrence.start, lastInstant) > 0;
}

export function occurrenceTouchesDay(occurrence: CalendarOccurrenceType, day: Date): boolean {
  const dayStart = startOfDay(day);
  return occurrence.start < addDays(dayStart, 1) && occurrence.end > dayStart;
}

export function compareOccurrences(a: CalendarOccurrenceType, b: CalendarOccurrenceType): number {
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  const byStart = a.start.getTime() - b.start.getTime();
  if (byStart !== 0) return byStart;
  const byLength = b.end.getTime() - b.start.getTime() - (a.end.getTime() - a.start.getTime());
  if (byLength !== 0) return byLength;
  return a.event.title.localeCompare(b.event.title);
}

/** Recurring occurrences share one definition, so they are never dragged individually. */
export function canEdit(occurrence: CalendarOccurrenceType, calendarEditable: boolean): boolean {
  if (occurrence.event.rrule) return false;
  return occurrence.event.editable ?? calendarEditable;
}
