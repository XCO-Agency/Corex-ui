import type { IndexTableHeadingType, IndexTableStickyType } from "./IndexTable.types";

/** Width of the selection checkbox column, in px. */
export const SELECTION_COLUMN_WIDTH = 32;
/** Width of the drag-handle column shown when rows are reorderable, in px. */
export const HANDLE_COLUMN_WIDTH = 28;

const DEFAULT_FIRST_MIN_WIDTH = 200;
const DEFAULT_NUMERIC_MIN_WIDTH = 80;
const DEFAULT_MIN_WIDTH = 120;

export type IndexTableAlignmentType = "start" | "center" | "end";

export type ResolvedColumnType = {
  /** CSS grid track for the column. */
  track: string;
  /** Narrowest the column renders, in px — summed into the grid's min width. */
  minWidth: number;
  alignment: IndexTableAlignmentType;
  sticky?: IndexTableStickyType;
  /** Distance from the pinned edge, e.g. `"32px"`. Set only for sticky columns. */
  offset?: string;
};

export type ResolvedLayoutType = {
  gridTemplateColumns: string;
  /** Sum of every column's min width; the grid never gets narrower. */
  minInlineSize: `${number}px`;
  columns: ResolvedColumnType[];
  /**
   * Leading control columns (drag handle, checkbox) are pinned whenever any
   * data column is pinned left, so they never scroll out from under it.
   */
  selectionSticky?: IndexTableStickyType;
  /** Left inset of the checkbox column — after the drag handle when there is one. */
  selectionOffset: `${number}px`;
};

function parsePx(value?: string): number | undefined {
  if (!value) return undefined;
  const match = /^\s*(\d+(?:\.\d+)?)px\s*$/.exec(value);
  return match ? Number(match[1]) : undefined;
}

export function resolveAlignment(
  heading?: Pick<IndexTableHeadingType, "alignment" | "format">,
): IndexTableAlignmentType {
  if (!heading) return "start";
  if (heading.alignment) return heading.alignment;
  return heading.format === "numeric" || heading.format === "currency" ? "end" : "start";
}

function defaultMinWidth(
  heading: IndexTableHeadingType,
  _index: number,
  isPrimary: boolean,
): number {
  if (isPrimary) return DEFAULT_FIRST_MIN_WIDTH;
  if (
    heading.format === "numeric" ||
    heading.format === "currency" ||
    heading.alignment === "center"
  ) {
    return DEFAULT_NUMERIC_MIN_WIDTH;
  }
  return DEFAULT_MIN_WIDTH;
}

/**
 * Turns headings into one shared grid layout: a track per column, the grid's
 * minimum width, and the inset of every pinned column.
 *
 * Pinned columns get a fixed px track, so the offset of each pinned column is
 * just the sum of the pinned columns between it and its edge.
 */
export function resolveLayout({
  headings,
  columnCount,
  selectable,
  reorderable = false,
  stickyOverrides,
}: {
  headings: IndexTableHeadingType[];
  /** Number of data columns, when there are more cells than headings. */
  columnCount: number;
  selectable: boolean;
  /** Adds the drag-handle column ahead of the checkbox. */
  reorderable?: boolean;
  /** Pins registered by cells (`<IndexTable.Cell sticky>`), by column index. */
  stickyOverrides: Record<number, IndexTableStickyType>;
}): ResolvedLayoutType {
  const count = Math.max(headings.length, columnCount);
  const firstNonHiddenIndex = headings.findIndex((h) => !h.hidden);
  const primaryIndex = firstNonHiddenIndex >= 0 ? firstNonHiddenIndex : 0;

  const columns: ResolvedColumnType[] = Array.from({ length: count }, (_, index) => {
    const heading = headings[index] ?? {};
    const sticky = stickyOverrides[index] ?? heading.sticky;
    const pxWidth = parsePx(heading.width);
    const isPrimary = index === primaryIndex;
    const minWidth = pxWidth ?? heading.minWidth ?? defaultMinWidth(heading, index, isPrimary);

    let track: string;
    if (sticky) {
      track = `${minWidth}px`;
    } else if (heading.width) {
      track = heading.width;
    } else {
      track = `minmax(${minWidth}px, ${isPrimary ? 2 : 1}fr)`;
    }

    return { track, minWidth, alignment: resolveAlignment(heading), sticky };
  });

  const leadingWidth =
    (reorderable ? HANDLE_COLUMN_WIDTH : 0) + (selectable ? SELECTION_COLUMN_WIDTH : 0);
  const selectionSticky: IndexTableStickyType | undefined =
    leadingWidth > 0 && columns.some((c) => c.sticky === "left") ? "left" : undefined;

  // Left pins stack from the left edge, after the control columns when they are pinned too.
  let left = selectionSticky ? leadingWidth : 0;
  for (const column of columns) {
    if (column.sticky !== "left") continue;
    column.offset = `${left}px`;
    left += column.minWidth;
  }

  // Right pins stack from the right edge.
  let right = 0;
  for (let i = columns.length - 1; i >= 0; i--) {
    const column = columns[i]!;
    if (column.sticky !== "right") continue;
    column.offset = `${right}px`;
    right += column.minWidth;
  }

  const tracks = columns.map((c) => c.track);
  if (selectable) tracks.unshift(`${SELECTION_COLUMN_WIDTH}px`);
  if (reorderable) tracks.unshift(`${HANDLE_COLUMN_WIDTH}px`);

  const minTotal = columns.reduce((sum, c) => sum + c.minWidth, 0) + leadingWidth;

  return {
    gridTemplateColumns: tracks.length > 0 ? tracks.join(" ") : "1fr",
    minInlineSize: `${minTotal}px` as const,
    columns,
    selectionSticky,
    selectionOffset: `${reorderable ? HANDLE_COLUMN_WIDTH : 0}px` as const,
  };
}

/**
 * Returns a copy of `items` with the item at `fromIndex` moved to `toIndex` —
 * the companion to `IndexTable`'s `onReorder`.
 */
export function reorderItems<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (moved === undefined) return next;
  next.splice(toIndex, 0, moved);
  return next;
}
