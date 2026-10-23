import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { CalendarOccurrenceType } from "../Calendar.types";
import { useCalendarContext } from "../Calendar.context";
import { useDaySelection } from "../hooks/useSelection";
import { useElementSize } from "../hooks/useElementSize";
import {
  addDays,
  addMonths,
  diffDays,
  fromDateKey,
  getISOWeekNumber,
  getMonthGrid,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfDay,
  toDateKey,
} from "../utils/date";
import { canEdit, isMultiDay, occurrenceTouchesDay } from "../utils/events";
import { formatWeekday } from "../utils/format";
import { applyDayMaxEvents, layoutWeekSegments } from "../utils/layout";
import { beginPointerSession, dateKeyFromPoint, rafThrottle } from "../utils/pointer";
import { DayCell } from "../parts/DayCell";
import { EventChip } from "../parts/EventChip";

type PreviewType = { start: Date; end: Date };

const DEFAULT_DAY_MAX_EVENTS = 3;
/** Narrow screens show dots only, so rows can be much shorter. */
const COMPACT_ROW_HEIGHT = 64;

export function MonthView() {
  const ctx = useCalendarContext();
  const gridRef = useRef<HTMLDivElement>(null);
  const size = useElementSize(gridRef);
  const headerRef = useRef<HTMLDivElement>(null);

  const weeks = useMemo(
    () => getMonthGrid(ctx.date, ctx.firstDay, ctx.fixedWeekCount),
    [ctx.date, ctx.firstDay, ctx.fixedWeekCount],
  );

  const visibleWeeks = useMemo(
    () => weeks.map((week) => (ctx.weekends ? week : week.filter((day) => !isWeekend(day)))),
    [weeks, ctx.weekends],
  );
  const columnCount = visibleWeeks[0]?.length ?? 7;

  const limit = useMemo(() => {
    const configured = ctx.dayMaxEvents;
    if (typeof configured === "number") return Math.max(1, Math.floor(configured));
    if (configured === false) return Number.POSITIVE_INFINITY;
    const headerHeight = headerRef.current?.offsetHeight ?? 0;
    const rowHeight =
      ctx.fixedHeight && size
        ? (size.height - headerHeight) / weeks.length
        : ctx.metrics.minRowHeight;
    const fit = Math.floor((rowHeight - ctx.metrics.dayNumberHeight) / ctx.metrics.laneHeight);
    return Math.max(1, Number.isFinite(fit) ? fit : DEFAULT_DAY_MAX_EVENTS);
  }, [ctx.dayMaxEvents, ctx.fixedHeight, ctx.metrics, size, weeks.length]);

  const layouts = useMemo(
    () =>
      visibleWeeks.map((days) => {
        const { segments } = layoutWeekSegments(ctx.occurrences, days);
        return applyDayMaxEvents(segments, days.length, limit);
      }),
    [visibleWeeks, ctx.occurrences, limit],
  );

  const [preview, setPreview] = useState<PreviewType | null>(null);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const [ghostTitle, setGhostTitle] = useState("");
  const ghostRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const beginSelection = useDaySelection({
    selectable: ctx.selectable,
    setSelection: ctx.setSelection,
    fireSelect: ctx.fireSelect,
  });

  const moveGhost = useMemo(
    () =>
      rafThrottle<void>(() => {
        const ghost = ghostRef.current;
        if (ghost) {
          ghost.style.transform = `translate3d(${pointerRef.current.x + 12}px, ${pointerRef.current.y + 12}px, 0)`;
        }
      }),
    [],
  );
  useEffect(() => () => moveGhost.cancel(), [moveGhost]);
  useLayoutEffect(() => {
    if (draggingKey) moveGhost(undefined);
  }, [draggingKey, moveGhost]);

  const previewRange = (start: Date, end: Date, allDay: boolean): PreviewType => ({
    start: startOfDay(start),
    end: allDay ? end : addDays(startOfDay(new Date(end.getTime() - 1)), 1),
  });

  const beginMove = (event: PointerEvent<HTMLElement>, occurrence: CalendarOccurrenceType) => {
    if (event.button !== 0) return;
    const pressKey = dateKeyFromPoint(event.currentTarget.ownerDocument, event.clientX, event.clientY) ?? toDateKey(occurrence.start);
    const pressDay = fromDateKey(pressKey);
    let targetKey: string | null = null;
    const doc = event.currentTarget.ownerDocument;
    pointerRef.current = { x: event.clientX, y: event.clientY };

    beginPointerSession(
      { clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId, target: event.currentTarget },
      {
        threshold: 4,
        onStart: () => {
          setGhostTitle(occurrence.event.title);
          setDraggingKey(occurrence.key);
        },
        onMove: (move) => {
          pointerRef.current = { x: move.clientX, y: move.clientY };
          moveGhost(undefined);
          const key = dateKeyFromPoint(doc, move.clientX, move.clientY);
          if (key && key !== targetKey) {
            targetKey = key;
            const delta = diffDays(pressDay, fromDateKey(key));
            setPreview(
              previewRange(
                addDays(occurrence.start, delta),
                addDays(occurrence.end, delta),
                occurrence.allDay,
              ),
            );
          }
        },
        onEnd: (_up, dragging) => {
          setDraggingKey(null);
          setPreview(null);
          if (!dragging || !targetKey) return;
          const delta = diffDays(pressDay, fromDateKey(targetKey));
          if (delta === 0) return;
          ctx.commitMove({
            event: occurrence.event,
            oldStart: occurrence.start,
            oldEnd: occurrence.end,
            newStart: addDays(occurrence.start, delta),
            newEnd: addDays(occurrence.end, delta),
            allDay: occurrence.allDay,
          });
        },
        onCancel: () => {
          setDraggingKey(null);
          setPreview(null);
        },
      },
    );
  };

  const beginResize = (event: PointerEvent<HTMLElement>, occurrence: CalendarOccurrenceType) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    const doc = event.currentTarget.ownerDocument;
    let newEnd = occurrence.end;

    beginPointerSession(
      { clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId, target: event.currentTarget },
      {
        threshold: 3,
        onStart: () => setDraggingKey(occurrence.key),
        onMove: (move) => {
          const key = dateKeyFromPoint(doc, move.clientX, move.clientY);
          if (!key) return;
          const lastDay = fromDateKey(key);
          const clamped = lastDay < occurrence.start ? occurrence.start : lastDay;
          newEnd = addDays(clamped, 1);
          setPreview({ start: occurrence.start, end: newEnd });
        },
        onEnd: (_up, dragging) => {
          setDraggingKey(null);
          setPreview(null);
          if (!dragging || newEnd.getTime() === occurrence.end.getTime()) return;
          ctx.commitResize({
            event: occurrence.event,
            oldStart: occurrence.start,
            oldEnd: occurrence.end,
            newStart: occurrence.start,
            newEnd,
            allDay: true,
          });
        },
        onCancel: () => {
          setDraggingKey(null);
          setPreview(null);
        },
      },
    );
  };

  const focusStopDate = useMemo(() => {
    const inGrid = visibleWeeks.some((week) => week.some((day) => isSameDay(day, ctx.focusDate)));
    return inGrid ? ctx.focusDate : (visibleWeeks[1]?.[0] ?? ctx.date);
  }, [visibleWeeks, ctx.focusDate, ctx.date]);

  useEffect(() => {
    if (!ctx.pendingFocusRef.current) return;
    ctx.pendingFocusRef.current = false;
    gridRef.current
      ?.querySelector<HTMLElement>(`[data-cx-date="${toDateKey(ctx.focusDate)}"]`)
      ?.focus();
  });

  const stepVisible = (from: Date, direction: 1 | -1): Date => {
    let next = addDays(from, direction);
    while (!ctx.weekends && isWeekend(next)) next = addDays(next, direction);
    return next;
  };

  const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.hasAttribute("data-cx-date")) return;
    const rtl = ctx.direction === "rtl";
    const from = ctx.focusDate;
    let next: Date | null = null;

    switch (event.key) {
      case "ArrowLeft":
        next = stepVisible(from, rtl ? 1 : -1);
        break;
      case "ArrowRight":
        next = stepVisible(from, rtl ? -1 : 1);
        break;
      case "ArrowUp":
        next = addDays(from, -7);
        break;
      case "ArrowDown":
        next = addDays(from, 7);
        break;
      case "PageUp":
        next = addMonths(from, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(from, event.shiftKey ? 12 : 1);
        break;
      case "Home":
      case "End": {
        const week = visibleWeeks.find((row) => row.some((day) => isSameDay(day, from)));
        if (week) next = event.key === "Home" ? week[0]! : week[week.length - 1]!;
        break;
      }
      case "t":
      case "T":
        next = ctx.today;
        break;
      default:
        return;
    }

    if (!next) return;
    event.preventDefault();
    event.stopPropagation();
    ctx.pendingFocusRef.current = true;
    if (isSameMonth(next, ctx.date)) ctx.setFocusDate(next);
    else ctx.gotoDate(next);
  };

  const headerDays = visibleWeeks[0] ?? [];
  const compact = ctx.compact;

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-labelledby={ctx.titleId}
      aria-rowcount={weeks.length + 1}
      data-slot="calendar-grid"
      data-view="month"
      data-compact={compact ? "" : undefined}
      data-weeknumbers={ctx.weekNumbers ? "" : undefined}
      className={ctx.classNames.grid}
      onKeyDown={handleGridKeyDown}
    >
      <div ref={headerRef} role="row" data-slot="calendar-weekdays">
        {ctx.weekNumbers ? <div role="columnheader" data-slot="calendar-weeknum-head" /> : null}
        <div data-slot="calendar-weekday-cells" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
          {headerDays.map((day) => (
            <div
              key={day.getDay()}
              role="columnheader"
              aria-label={formatWeekday(day, ctx.locale, "long")}
              data-slot="calendar-weekday"
            >
              {formatWeekday(day, ctx.locale, "short")}
            </div>
          ))}
        </div>
      </div>

      <div data-slot="calendar-weeks" style={{
          gridTemplateRows: `repeat(${weeks.length}, minmax(${compact ? COMPACT_ROW_HEIGHT : ctx.metrics.minRowHeight}px, 1fr))`,
        }}>
        {visibleWeeks.map((days, weekIndex) => {
          const layout = layouts[weekIndex]!;
          return (
            <div key={toDateKey(days[0]!)} role="row" data-slot="calendar-week">
              {ctx.weekNumbers ? (
                <div role="rowheader" data-slot="calendar-weeknum" aria-label={`Week ${getISOWeekNumber(days[0]!)}`}>
                  {getISOWeekNumber(days[0]!)}
                </div>
              ) : null}
              <div data-slot="calendar-week-cells" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
                {days.map((day) => {
                  const selection = ctx.selection;
                  const inSelection = Boolean(
                    selection && day >= selection.start && day < selection.end,
                  );
                  const dropTarget = Boolean(preview && day >= preview.start && day < preview.end);
                  return (
                    <DayCell
                      key={toDateKey(day)}
                      day={day}
                      isOutside={!isSameMonth(day, ctx.date)}
                      isToday={isSameDay(day, ctx.today)}
                      inSelection={inSelection}
                      isDropTarget={dropTarget}
                      isFocusStop={isSameDay(day, focusStopDate)}
                      onPointerDown={beginSelection}
                    >
                      {compact ? (
                        <div data-slot="calendar-pips">
                          {ctx.occurrences
                            .filter((occurrence) => occurrenceTouchesDay(occurrence, day))
                            .slice(0, 6)
                            .map((occurrence) => (
                              <EventChip key={occurrence.key} occurrence={occurrence} variant="pip" />
                            ))}
                        </div>
                      ) : null}
                    </DayCell>
                  );
                })}
              </div>

              {compact ? null : (
                <div
                  data-slot="calendar-week-events"
                  style={{
                    gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
                  }}
                >
                  {layout.pieces.map((piece, index) => {
                    const { occurrence } = piece;
                    const bar = occurrence.allDay || isMultiDay(occurrence);
                    const editable = canEdit(occurrence, ctx.editable);
                    const resizable = editable && occurrence.allDay && !piece.continuesAfter;
                    return (
                      <EventChip
                        key={`${occurrence.key}:${piece.startCol}`}
                        occurrence={occurrence}
                        variant={bar ? "bar" : "dot"}
                        index={index}
                        continuesBefore={piece.continuesBefore}
                        continuesAfter={piece.continuesAfter}
                        dragging={draggingKey === occurrence.key}
                        onPointerDown={editable ? beginMove : undefined}
                        style={{
                          gridColumn: `${piece.startCol + 1} / ${piece.endCol + 2}`,
                          gridRow: piece.lane + 1,
                        }}
                      >
                        {resizable ? (
                          <span
                            data-slot="calendar-resize"
                            data-edge="end"
                            onPointerDown={(down) => beginResize(down, occurrence)}
                          />
                        ) : null}
                      </EventChip>
                    );
                  })}
                  {layout.moreLinks.map((link) => {
                    const day = days[link.col]!;
                    return (
                      <button
                        key={`more-${link.col}`}
                        type="button"
                        data-slot="calendar-more"
                        aria-haspopup="dialog"
                        style={{ gridColumn: link.col + 1, gridRow: link.lane + 1 }}
                        onClick={() => ctx.openDayList(day)}
                      >
                        +{link.count} more
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {draggingKey && ghostTitle ? (
        <div ref={ghostRef} data-slot="calendar-drag-ghost" aria-hidden="true">
          {ghostTitle}
        </div>
      ) : null}
    </div>
  );
}
