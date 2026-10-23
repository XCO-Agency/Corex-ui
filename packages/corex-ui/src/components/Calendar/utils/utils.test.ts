import { describe, expect, it } from "vitest";
import type { CalendarOccurrenceType } from "../Calendar.types";
import {
  addDays,
  addMonths,
  diffDays,
  getISOWeekNumber,
  getMonthGrid,
  isLeapYear,
  parseDateInput,
  parseTimeToMinutes,
  startOfWeek,
  toDateKey,
} from "./date";
import { resolveOccurrences } from "./events";
import { applyDayMaxEvents, layoutTimeColumn, layoutWeekSegments } from "./layout";
import { expandRecurrence, parseRRule } from "./recurrence";

const d = (key: string) => parseDateInput(key);

function occ(id: string, start: string, end: string, allDay = true): CalendarOccurrenceType {
  return {
    key: id,
    event: { id, title: id, start, end, allDay },
    start: d(start),
    end: d(end),
    allDay,
  };
}

describe("date helpers", () => {
  it("builds a six-week month grid starting on firstDay", () => {
    const sunday = getMonthGrid(d("2026-10-15"), 0);
    expect(sunday).toHaveLength(6);
    expect(toDateKey(sunday[0]![0]!)).toBe("2026-09-27");
    expect(sunday[0]![0]!.getDay()).toBe(0);

    const monday = getMonthGrid(d("2026-10-15"), 1);
    expect(toDateKey(monday[0]![0]!)).toBe("2026-09-28");
    expect(monday[0]![0]!.getDay()).toBe(1);
  });

  it("can size the grid to the month", () => {
    // February 2026 starts on Sunday and has 28 days: exactly four weeks.
    expect(getMonthGrid(d("2026-02-10"), 0, false)).toHaveLength(4);
  });

  it("handles leap years and month-end clamping", () => {
    expect(isLeapYear(2028)).toBe(true);
    expect(isLeapYear(2100)).toBe(false);
    expect(toDateKey(addMonths(d("2028-01-31"), 1))).toBe("2028-02-29");
    expect(toDateKey(addMonths(d("2026-01-31"), 1))).toBe("2026-02-28");
  });

  it("keeps calendar-day math stable across DST changes", () => {
    // US DST starts 2026-03-08; day arithmetic must stay on midnight.
    const before = d("2026-03-07");
    const after = addDays(before, 2);
    expect(toDateKey(after)).toBe("2026-03-09");
    expect(after.getHours()).toBe(0);
    expect(diffDays(before, after)).toBe(2);
    expect(diffDays(d("2026-10-31"), d("2026-11-02"))).toBe(2);
  });

  it("parses date-only strings as local midnight", () => {
    const date = d("2026-10-21");
    expect(date.getDate()).toBe(21);
    expect(date.getHours()).toBe(0);
  });

  it("computes ISO week numbers", () => {
    expect(getISOWeekNumber(d("2026-01-01"))).toBe(1);
    expect(getISOWeekNumber(d("2027-01-01"))).toBe(53);
    expect(getISOWeekNumber(d("2026-10-21"))).toBe(43);
  });

  it("finds the start of week", () => {
    expect(toDateKey(startOfWeek(d("2026-10-21"), 1))).toBe("2026-10-19");
    expect(toDateKey(startOfWeek(d("2026-10-19"), 1))).toBe("2026-10-19");
  });

  it("parses HH:mm", () => {
    expect(parseTimeToMinutes("08:30", 0)).toBe(510);
    expect(parseTimeToMinutes("24:00", 0)).toBe(1440);
    expect(parseTimeToMinutes("nope", 60)).toBe(60);
  });
});

describe("occurrence resolution", () => {
  const range = { start: d("2026-10-01"), end: d("2026-11-01") };

  it("defaults all-day events to one day and timed events to one hour", () => {
    const [allDay, timed] = resolveOccurrences(
      [
        { id: "a", title: "A", start: "2026-10-05", allDay: true },
        { id: "b", title: "B", start: "2026-10-05T09:00:00" },
      ],
      range,
    );
    expect(toDateKey(allDay!.end)).toBe("2026-10-06");
    expect(timed!.end.getTime() - timed!.start.getTime()).toBe(3_600_000);
  });

  it("drops events outside the range and invalid dates", () => {
    const result = resolveOccurrences(
      [
        { id: "a", title: "A", start: "2026-12-05", allDay: true },
        { id: "b", title: "B", start: "not a date" },
      ],
      range,
    );
    expect(result).toHaveLength(0);
  });

  it("expands recurring events inside the range", () => {
    const result = resolveOccurrences(
      [{ id: "r", title: "Standup", start: "2026-09-28T09:00:00", rrule: "FREQ=WEEKLY;BYDAY=MO,WE" }],
      range,
    );
    expect(result.map((item) => toDateKey(item.start))).toEqual([
      "2026-10-05",
      "2026-10-07",
      "2026-10-12",
      "2026-10-14",
      "2026-10-19",
      "2026-10-21",
      "2026-10-26",
      "2026-10-28",
    ]);
    expect(result[0]!.start.getHours()).toBe(9);
  });
});

describe("recurrence", () => {
  const range = { start: d("2026-01-01"), end: d("2027-01-01") };

  it("parses rules", () => {
    expect(parseRRule("RRULE:FREQ=DAILY;INTERVAL=2;COUNT=3")).toMatchObject({
      freq: "DAILY",
      interval: 2,
      count: 3,
    });
    expect(parseRRule("FREQ=HOURLY")).toBeNull();
  });

  it("honours COUNT and INTERVAL", () => {
    const starts = expandRecurrence(
      { id: "x", title: "x", start: "2026-03-01", rrule: "FREQ=DAILY;INTERVAL=2;COUNT=3" },
      range,
    );
    expect(starts.map(toDateKey)).toEqual(["2026-03-01", "2026-03-03", "2026-03-05"]);
  });

  it("honours UNTIL and skips short months", () => {
    const starts = expandRecurrence(
      { id: "x", title: "x", start: "2026-01-31", rrule: "FREQ=MONTHLY;UNTIL=20260531" },
      range,
    );
    expect(starts.map(toDateKey)).toEqual(["2026-01-31", "2026-03-31", "2026-05-31"]);
  });
});

describe("week lane layout", () => {
  const week = Array.from({ length: 7 }, (_, index) => addDays(d("2026-10-18"), index));

  it("keeps multi-day bars on stable lanes and marks continuation", () => {
    const { segments, laneCount } = layoutWeekSegments(
      [
        occ("short", "2026-10-19", "2026-10-20"),
        occ("long", "2026-10-15", "2026-10-22"),
        occ("later", "2026-10-21", "2026-10-26"),
      ],
      week,
    );
    const byId = Object.fromEntries(segments.map((segment) => [segment.occurrence.key, segment]));
    expect(byId.long).toMatchObject({ startCol: 0, endCol: 3, lane: 0, continuesBefore: true, continuesAfter: false });
    expect(byId.short).toMatchObject({ startCol: 1, endCol: 1, lane: 1 });
    expect(byId.later).toMatchObject({ startCol: 3, endCol: 6, lane: 1, continuesAfter: true });
    expect(laneCount).toBe(2);
  });

  it("skips hidden weekend columns", () => {
    const weekdays = week.filter((day) => day.getDay() !== 0 && day.getDay() !== 6);
    const { segments } = layoutWeekSegments([occ("sat", "2026-10-24", "2026-10-25")], weekdays);
    expect(segments).toHaveLength(0);
  });

  it("caps events per day with a more link and splits bars around it", () => {
    const { segments } = layoutWeekSegments(
      [
        occ("bar", "2026-10-18", "2026-10-21"),
        occ("a", "2026-10-19", "2026-10-20"),
        occ("b", "2026-10-19", "2026-10-20"),
        occ("c", "2026-10-19", "2026-10-20"),
      ],
      week,
    );
    const { pieces, moreLinks } = applyDayMaxEvents(segments, 7, 2);
    expect(moreLinks).toEqual([{ col: 1, lane: 1, count: 3 }]);
    const barPieces = pieces.filter((piece) => piece.occurrence.key === "bar");
    // The bar is on lane 0 so it stays visible across all three days.
    expect(barPieces).toHaveLength(1);
    expect(barPieces[0]).toMatchObject({ startCol: 0, endCol: 2 });
  });
});

describe("time column layout", () => {
  it("places overlapping events side by side", () => {
    const result = layoutTimeColumn([
      { id: "a", start: 540, end: 600 },
      { id: "b", start: 570, end: 630 },
      { id: "c", start: 600, end: 660 },
      { id: "d", start: 700, end: 760 },
    ]);
    const byId = Object.fromEntries(result.map((entry) => [entry.item.id, entry]));
    expect(byId.a).toMatchObject({ column: 0, columns: 2 });
    expect(byId.b).toMatchObject({ column: 1, columns: 2 });
    expect(byId.c).toMatchObject({ column: 0, columns: 2 });
    expect(byId.d).toMatchObject({ column: 0, columns: 1 });
  });
});
