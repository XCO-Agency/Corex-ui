import type { CalendarOccurrenceType } from "../Calendar.types";
import { addDays, startOfDay } from "./date";
import { compareOccurrences } from "./events";

export type WeekSegmentType = {
  occurrence: CalendarOccurrenceType;
  /** Inclusive column indexes into the `days` passed to `layoutWeekSegments`. */
  startCol: number;
  endCol: number;
  /** Row ("lane") the bar sits on; stable for the whole segment. */
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
};

/**
 * Packs occurrences onto lanes for one row of day columns. Longer events win
 * the upper lanes so a multi-day bar keeps one row across the week.
 * `days` may skip days (hidden weekends); an event only occupies columns that exist.
 */
export function layoutWeekSegments(
  occurrences: CalendarOccurrenceType[],
  days: Date[],
): { segments: WeekSegmentType[]; laneCount: number } {
  const dayStarts = days.map((day) => startOfDay(day));
  const dayEnds = dayStarts.map((day) => addDays(day, 1));

  const raw: Omit<WeekSegmentType, "lane">[] = [];
  for (const occurrence of occurrences) {
    let startCol = -1;
    let endCol = -1;
    for (let index = 0; index < days.length; index += 1) {
      if (occurrence.start < dayEnds[index]! && occurrence.end > dayStarts[index]!) {
        if (startCol === -1) startCol = index;
        endCol = index;
      }
    }
    if (startCol === -1) continue;
    raw.push({
      occurrence,
      startCol,
      endCol,
      continuesBefore: occurrence.start < dayStarts[startCol]!,
      continuesAfter: occurrence.end > dayEnds[endCol]!,
    });
  }

  raw.sort((a, b) => {
    if (a.startCol !== b.startCol) return a.startCol - b.startCol;
    const spanDiff = b.endCol - b.startCol - (a.endCol - a.startCol);
    if (spanDiff !== 0) return spanDiff;
    return compareOccurrences(a.occurrence, b.occurrence);
  });

  const laneEnds: number[] = [];
  const segments: WeekSegmentType[] = raw.map((segment) => {
    let lane = laneEnds.findIndex((end) => end < segment.startCol);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(segment.endCol);
    } else {
      laneEnds[lane] = segment.endCol;
    }
    return { ...segment, lane };
  });

  return { segments, laneCount: laneEnds.length };
}

export type VisibleSegmentPieceType = Pick<
  WeekSegmentType,
  "occurrence" | "startCol" | "endCol" | "lane" | "continuesBefore" | "continuesAfter"
>;

export type MoreLinkType = { col: number; lane: number; count: number };

/**
 * Applies a per-day cap. A day with more than `limit` events shows
 * `limit - 1` of them plus a "+N more" row; bars crossing such a day are
 * split into pieces around it.
 */
export function applyDayMaxEvents(
  segments: WeekSegmentType[],
  columnCount: number,
  limit: number,
): { pieces: VisibleSegmentPieceType[]; moreLinks: MoreLinkType[] } {
  const totals = new Array<number>(columnCount).fill(0);
  for (const segment of segments) {
    for (let col = segment.startCol; col <= segment.endCol; col += 1) totals[col]! += 1;
  }
  const overflow = totals.map((total) => total > limit);
  const visibleLaneFor = (col: number) => (overflow[col] ? limit - 1 : limit);

  const visible = new Array<number>(columnCount).fill(0);
  const pieces: VisibleSegmentPieceType[] = [];

  for (const segment of segments) {
    let pieceStart = -1;
    const flush = (pieceEnd: number) => {
      if (pieceStart === -1) return;
      pieces.push({
        ...segment,
        startCol: pieceStart,
        endCol: pieceEnd,
        continuesBefore: pieceStart > segment.startCol || segment.continuesBefore,
        continuesAfter: pieceEnd < segment.endCol || segment.continuesAfter,
      });
      pieceStart = -1;
    };
    for (let col = segment.startCol; col <= segment.endCol; col += 1) {
      if (segment.lane < visibleLaneFor(col)) {
        if (pieceStart === -1) pieceStart = col;
        visible[col]! += 1;
      } else {
        flush(col - 1);
      }
    }
    flush(segment.endCol);
  }

  const moreLinks: MoreLinkType[] = [];
  for (let col = 0; col < columnCount; col += 1) {
    if (overflow[col]) {
      moreLinks.push({ col, lane: Math.max(0, limit - 1), count: totals[col]! - visible[col]! });
    }
  }
  return { pieces, moreLinks };
}

export type TimedItemType = { start: number; end: number };

export type PositionedItemType<T> = { item: T; column: number; columns: number };

/**
 * Side-by-side column packing for overlapping timed events in one day:
 * each cluster of mutually-chained overlaps shares the width evenly.
 */
export function layoutTimeColumn<T extends TimedItemType>(items: T[]): PositionedItemType<T>[] {
  const sorted = [...items].sort((a, b) => a.start - b.start || b.end - a.end);
  const result: PositionedItemType<T>[] = [];

  let cluster: PositionedItemType<T>[] = [];
  let columnEnds: number[] = [];
  let clusterEnd = -Infinity;

  const closeCluster = () => {
    for (const entry of cluster) entry.columns = columnEnds.length;
    result.push(...cluster);
    cluster = [];
    columnEnds = [];
  };

  for (const item of sorted) {
    if (cluster.length > 0 && item.start >= clusterEnd) closeCluster();
    let column = columnEnds.findIndex((end) => end <= item.start);
    if (column === -1) {
      column = columnEnds.length;
      columnEnds.push(item.end);
    } else {
      columnEnds[column] = item.end;
    }
    cluster.push({ item, column, columns: 1 });
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  closeCluster();

  return result;
}
