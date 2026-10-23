import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import type { CalendarOccurrenceType } from "../Calendar.types";
import { useCalendarContext } from "../Calendar.context";
import { AUTO_TIME_GRID_HEIGHT } from "../Calendar.constants";
import { useDaySelection } from "../hooks/useSelection";
import { useElementSize } from "../hooks/useElementSize";
import {
  addDays,
  atMinutes,
  clampNumber,
  diffDays,
  isSameDay,
  minutesOfDay,
  startOfDay,
  toDateKey,
} from "../utils/date";
import { canEdit } from "../utils/events";
import { formatFullDate, formatHour, formatWeekday } from "../utils/format";
import { layoutTimeColumn, layoutWeekSegments } from "../utils/layout";
import { beginPointerSession, wasJustDragged } from "../utils/pointer";
import { EventChip } from "./EventChip";
import { NowIndicator } from "./NowIndicator";

type TimedPieceType = {
  occurrence: CalendarOccurrenceType;
  start: number;
  end: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
};

type GhostType = { occurrence: CalendarOccurrenceType; start: Date; end: Date };

const MIN_BLOCK_PX = 18;
const GUTTER_STYLE_VAR = "--cx-cal-sb";

function addMinutes(date: Date, minutes: number): Date {
  const next = new Date(date.getTime());
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

/** Clips an occurrence to one day's visible minutes. */
function clipToDay(
  occurrence: { start: Date; end: Date },
  day: Date,
  minMinutes: number,
  maxMinutes: number,
): Omit<TimedPieceType, "occurrence"> | null {
  const visibleStart = atMinutes(day, minMinutes);
  const visibleEnd = atMinutes(day, maxMinutes);
  if (occurrence.start >= visibleEnd || occurrence.end <= visibleStart) return null;
  const clippedStart = occurrence.start > visibleStart ? occurrence.start : visibleStart;
  const clippedEnd = occurrence.end < visibleEnd ? occurrence.end : visibleEnd;
  const dayStart = startOfDay(day);
  const toMinutes = (date: Date) => (date.getTime() - dayStart.getTime()) / 60_000;
  return {
    start: Math.max(minMinutes, toMinutes(clippedStart)),
    end: Math.min(maxMinutes, toMinutes(clippedEnd)),
    continuesBefore: occurrence.start < visibleStart,
    continuesAfter: occurrence.end > visibleEnd,
  };
}

export type TimeGridPropsType = { days: Date[] };

/** Shared body of the week and day views: header, all-day lanes and the scrolling time grid. */
export function TimeGrid({ days }: TimeGridPropsType) {
  const ctx = useCalendarContext();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const rtl = ctx.direction === "rtl";

  const slotMin = ctx.slotMinMinutes;
  const slotMax = ctx.slotMaxMinutes;
  const slot = ctx.slotDuration;
  const slotHeight = ctx.metrics.slotHeight;
  const pxPerMinute = slotHeight / slot;
  const totalHeight = (slotMax - slotMin) * pxPerMinute;
  const slotsPerHour = 60 % slot === 0 ? 60 / slot : 1;

  const [ghost, setGhost] = useState<GhostType | null>(null);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);

  const { allDay, timed } = useMemo(() => {
    const allDayList: CalendarOccurrenceType[] = [];
    const timedList: CalendarOccurrenceType[] = [];
    for (const occurrence of ctx.occurrences) {
      (occurrence.allDay ? allDayList : timedList).push(occurrence);
    }
    return { allDay: allDayList, timed: timedList };
  }, [ctx.occurrences]);

  const allDayLayout = useMemo(() => layoutWeekSegments(allDay, days), [allDay, days]);

  const columns = useMemo(
    () =>
      days.map((day) => {
        const pieces: TimedPieceType[] = [];
        for (const occurrence of timed) {
          const clipped = clipToDay(occurrence, day, slotMin, slotMax);
          if (clipped) pieces.push({ occurrence, ...clipped });
        }
        return layoutTimeColumn(
          pieces.map((piece) => ({
            ...piece,
            end: Math.max(piece.end, piece.start + MIN_BLOCK_PX / pxPerMinute),
          })),
        );
      }),
    [days, timed, slotMin, slotMax, pxPerMinute],
  );

  const scrollSize = useElementSize(scrollRef);
  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    const root = rootRef.current;
    if (!scroller || !root) return;
    root.style.setProperty(GUTTER_STYLE_VAR, `${scroller.offsetWidth - scroller.clientWidth}px`);
  }, [scrollSize]);

  const rangeKey = `${ctx.view}:${toDateKey(days[0]!)}`;
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const nowMinutes = minutesOfDay(ctx.now);
    const showsToday = days.some((day) => isSameDay(day, ctx.today));
    const target =
      showsToday && nowMinutes >= slotMin && nowMinutes <= slotMax
        ? nowMinutes
        : (ctx.businessHours?.startMinutes ?? 8 * 60);
    scroller.scrollTop = Math.max(0, (clampNumber(target, slotMin, slotMax) - slotMin) * pxPerMinute - slotHeight * 2);
    // Only when the visible range or view changes, not on each clock tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKey]);

  const pointToSlot = (clientX: number, clientY: number) => {
    const rect = colsRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return { dayIndex: 0, minutes: slotMin };
    const x = rtl ? rect.right - clientX : clientX - rect.left;
    const dayIndex = clampNumber(Math.floor(x / (rect.width / days.length)), 0, days.length - 1);
    const minutes = clampNumber(slotMin + (clientY - rect.top) / pxPerMinute, slotMin, slotMax);
    return { dayIndex, minutes };
  };
  const snap = (minutes: number) => slotMin + Math.round((minutes - slotMin) / slot) * slot;
  const floorSlot = (minutes: number) => slotMin + Math.floor((minutes - slotMin) / slot) * slot;

  const beginMove = (event: PointerEvent<HTMLElement>, occurrence: CalendarOccurrenceType) => {
    if (event.button !== 0) return;
    const pressed = pointToSlot(event.clientX, event.clientY);
    const pressedSnap = snap(pressed.minutes);
    const durationMinutes = (occurrence.end.getTime() - occurrence.start.getTime()) / 60_000;
    let latest: GhostType | null = null;

    beginPointerSession(
      { clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId, target: event.currentTarget },
      {
        threshold: 4,
        onStart: () => setDraggingKey(occurrence.key),
        onMove: (move) => {
          const current = pointToSlot(move.clientX, move.clientY);
          const deltaDays = diffDays(days[pressed.dayIndex]!, days[current.dayIndex]!);
          const deltaMinutes = snap(current.minutes) - pressedSnap;
          const start = addMinutes(addDays(occurrence.start, deltaDays), deltaMinutes);
          const end = addMinutes(start, durationMinutes);
          if (!latest || latest.start.getTime() !== start.getTime()) {
            latest = { occurrence, start, end };
            setGhost(latest);
          }
        },
        onEnd: (_up, dragging) => {
          setDraggingKey(null);
          setGhost(null);
          if (!dragging || !latest || latest.start.getTime() === occurrence.start.getTime()) return;
          ctx.commitMove({
            event: occurrence.event,
            oldStart: occurrence.start,
            oldEnd: occurrence.end,
            newStart: latest.start,
            newEnd: latest.end,
            allDay: false,
          });
        },
        onCancel: () => {
          setDraggingKey(null);
          setGhost(null);
        },
      },
    );
  };

  const beginResize = (event: PointerEvent<HTMLElement>, occurrence: CalendarOccurrenceType) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    const endDay = startOfDay(new Date(occurrence.end.getTime() - 1));
    const earliestEnd = addMinutes(occurrence.start, slot);
    let latest: GhostType | null = null;

    beginPointerSession(
      { clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId, target: event.currentTarget },
      {
        threshold: 3,
        onStart: () => setDraggingKey(occurrence.key),
        onMove: (move) => {
          const { minutes } = pointToSlot(move.clientX, move.clientY);
          let end = atMinutes(endDay, snap(minutes));
          if (end < earliestEnd) end = earliestEnd;
          if (!latest || latest.end.getTime() !== end.getTime()) {
            latest = { occurrence, start: occurrence.start, end };
            setGhost(latest);
          }
        },
        onEnd: (_up, dragging) => {
          setDraggingKey(null);
          setGhost(null);
          if (!dragging || !latest || latest.end.getTime() === occurrence.end.getTime()) return;
          ctx.commitResize({
            event: occurrence.event,
            oldStart: occurrence.start,
            oldEnd: occurrence.end,
            newStart: occurrence.start,
            newEnd: latest.end,
            allDay: false,
          });
        },
        onCancel: () => {
          setDraggingKey(null);
          setGhost(null);
        },
      },
    );
  };

  const beginSlotSelection = (event: PointerEvent<HTMLElement>) => {
    if (!ctx.selectable || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('[data-slot="calendar-event"]')) return;
    const anchor = pointToSlot(event.clientX, event.clientY);
    const anchorSlot = floorSlot(anchor.minutes);
    const day = days[anchor.dayIndex]!;
    let latest: { start: Date; end: Date } | null = null;

    beginPointerSession(
      { clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId, target: event.currentTarget },
      {
        threshold: 4,
        onMove: (move) => {
          const current = floorSlot(pointToSlot(move.clientX, move.clientY).minutes);
          const first = Math.min(anchorSlot, current);
          const last = Math.min(Math.max(anchorSlot, current) + slot, slotMax);
          latest = { start: atMinutes(day, first), end: atMinutes(day, last) };
          ctx.setSelection({ ...latest, allDay: false });
        },
        onEnd: (_up, dragging) => {
          if (dragging && latest) ctx.fireSelect({ ...latest, allDay: false });
        },
        onCancel: () => ctx.setSelection(null),
      },
    );
  };

  const handleColumnsClick = (event: MouseEvent<HTMLElement>) => {
    if (wasJustDragged()) return;
    if ((event.target as HTMLElement).closest('[data-slot="calendar-event"]')) return;
    const { dayIndex, minutes } = pointToSlot(event.clientX, event.clientY);
    const day = days[dayIndex]!;
    ctx.setFocusDate(day);
    ctx.fireDateClick({ date: atMinutes(day, floorSlot(minutes)), allDay: false });
  };

  const beginAllDaySelection = useDaySelection({
    selectable: ctx.selectable,
    setSelection: ctx.setSelection,
    fireSelect: ctx.fireSelect,
  });

  const hourMarks = useMemo(() => {
    const marks: number[] = [];
    for (let minutes = Math.ceil(slotMin / 60) * 60; minutes < slotMax; minutes += 60) {
      marks.push(minutes);
    }
    return marks;
  }, [slotMin, slotMax]);

  const columnTemplate = `repeat(${days.length}, minmax(0, 1fr))`;
  const gridStyle = {
    "--cx-cal-slot-h": `${slotHeight}px`,
    "--cx-cal-hour-h": `${slotHeight * slotsPerHour}px`,
    ...(ctx.fixedHeight ? null : { "--cx-cal-scroll-max": `${AUTO_TIME_GRID_HEIGHT}px` }),
  } as CSSProperties;

  const renderBlock = (
    piece: TimedPieceType,
    column: number,
    columnCount: number,
    index: number,
    options?: { ghost?: boolean },
  ) => {
    const { occurrence } = piece;
    const top = (piece.start - slotMin) * pxPerMinute;
    const height = Math.max(MIN_BLOCK_PX, (piece.end - piece.start) * pxPerMinute);
    const editable = canEdit(occurrence, ctx.editable);
    const widthPercent = 100 / columnCount;
    const style: CSSProperties = {
      top: options?.ghost ? 0 : top,
      transform: options?.ghost ? `translateY(${top}px)` : undefined,
      height,
      insetInlineStart: `calc(${column * widthPercent}% + 1px)`,
      width: `calc(${widthPercent}% - 3px)`,
    };
    return (
      <EventChip
        key={`${options?.ghost ? "ghost:" : ""}${occurrence.key}`}
        occurrence={occurrence}
        variant="block"
        index={index}
        continuesBefore={piece.continuesBefore}
        continuesAfter={piece.continuesAfter}
        dragging={!options?.ghost && draggingKey === occurrence.key}
        ghost={options?.ghost}
        short={height < 40}
        style={style}
        onPointerDown={editable && !options?.ghost ? beginMove : undefined}
      >
        {editable && !options?.ghost && !piece.continuesAfter ? (
          <span
            data-slot="calendar-resize"
            data-edge="bottom"
            onPointerDown={(down) => beginResize(down, occurrence)}
          />
        ) : null}
      </EventChip>
    );
  };

  const nowMinutes = minutesOfDay(ctx.now);

  return (
    <div
      ref={rootRef}
      data-slot="calendar-timegrid"
      data-view={ctx.view}
      role="group"
      aria-labelledby={ctx.titleId}
      className={ctx.classNames.timeGrid}
      style={gridStyle}
    >
      <div data-slot="calendar-tg-head">
        <div data-slot="calendar-gutter" />
        <div data-slot="calendar-tg-days" style={{ gridTemplateColumns: columnTemplate }}>
          {days.map((day) => {
            const today = isSameDay(day, ctx.today);
            const content = (
              <>
                <span data-slot="calendar-tg-weekday">{formatWeekday(day, ctx.locale)}</span>
                <span data-slot="calendar-tg-date" data-today={today ? "" : undefined} data-pulse={today && ctx.pulseToday ? "" : undefined}>
                  {day.getDate()}
                </span>
              </>
            );
            return ctx.view === "week" ? (
              <button
                key={toDateKey(day)}
                type="button"
                data-slot="calendar-tg-day"
                aria-label={formatFullDate(day, ctx.locale)}
                onClick={() => {
                  ctx.gotoDate(day);
                  ctx.changeView("day");
                }}
              >
                {content}
              </button>
            ) : (
              <div key={toDateKey(day)} data-slot="calendar-tg-day">
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <div data-slot="calendar-tg-allday">
        <div data-slot="calendar-gutter">all-day</div>
        <div data-slot="calendar-allday-body">
          <div data-slot="calendar-allday-cells" style={{ gridTemplateColumns: columnTemplate }}>
            {days.map((day) => {
              const selection = ctx.selection;
              const inSelection = Boolean(
                selection?.allDay && day >= selection.start && day < selection.end,
              );
              return (
                <div
                  key={toDateKey(day)}
                  data-slot="calendar-allday-cell"
                  data-cx-date={toDateKey(day)}
                  data-today={isSameDay(day, ctx.today) ? "" : undefined}
                  data-selected={inSelection ? "" : undefined}
                  onClick={() => {
                    if (wasJustDragged()) return;
                    ctx.setFocusDate(day);
                    ctx.fireDateClick({ date: day, allDay: true });
                  }}
                  onPointerDown={(down) => beginAllDaySelection(down, day)}
                />
              );
            })}
          </div>
          <div data-slot="calendar-week-events" style={{ gridTemplateColumns: columnTemplate }}>
            {allDayLayout.segments.map((segment, index) => (
              <EventChip
                key={`${segment.occurrence.key}`}
                occurrence={segment.occurrence}
                variant="bar"
                index={index}
                continuesBefore={segment.continuesBefore}
                continuesAfter={segment.continuesAfter}
                style={{
                  gridColumn: `${segment.startCol + 1} / ${segment.endCol + 2}`,
                  gridRow: segment.lane + 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div ref={scrollRef} data-slot="calendar-tg-scroll">
        <div data-slot="calendar-tg-body" style={{ height: totalHeight }}>
          <div data-slot="calendar-gutter" aria-hidden="true">
            {hourMarks.map((minutes) => (
              <span
                key={minutes}
                data-slot="calendar-hour"
                style={{ top: (minutes - slotMin) * pxPerMinute }}
              >
                {minutes === slotMin ? "" : formatHour(minutes, ctx.locale)}
              </span>
            ))}
          </div>
          <div
            ref={colsRef}
            data-slot="calendar-tg-cols"
            style={{ gridTemplateColumns: columnTemplate }}
            onClick={handleColumnsClick}
            onPointerDown={beginSlotSelection}
          >
            {days.map((day, dayIndex) => {
              const today = isSameDay(day, ctx.today);
              const hours = ctx.businessHours;
              const selection = ctx.selection;
              const selectionPiece =
                selection && !selection.allDay ? clipToDay(selection, day, slotMin, slotMax) : null;
              const ghostPiece = ghost ? clipToDay(ghost, day, slotMin, slotMax) : null;
              const closed: Array<[number, number]> = [];
              if (hours) {
                if (hours.daysOfWeek.includes(day.getDay())) {
                  if (hours.startMinutes > slotMin) closed.push([slotMin, Math.min(hours.startMinutes, slotMax)]);
                  if (hours.endMinutes < slotMax) closed.push([Math.max(hours.endMinutes, slotMin), slotMax]);
                } else {
                  closed.push([slotMin, slotMax]);
                }
              }
              return (
                <div
                  key={toDateKey(day)}
                  data-slot="calendar-tg-col"
                  data-cx-date={toDateKey(day)}
                  data-today={today ? "" : undefined}
                >
                  {closed.map(([from, to]) => (
                    <div
                      key={from}
                      data-slot="calendar-closed"
                      aria-hidden="true"
                      style={{ top: (from - slotMin) * pxPerMinute, height: (to - from) * pxPerMinute }}
                    />
                  ))}
                  {selectionPiece ? (
                    <div
                      data-slot="calendar-selection"
                      aria-hidden="true"
                      style={{
                        top: (selectionPiece.start - slotMin) * pxPerMinute,
                        height: (selectionPiece.end - selectionPiece.start) * pxPerMinute,
                      }}
                    />
                  ) : null}
                  {columns[dayIndex]!.map((positioned, index) =>
                    renderBlock(positioned.item, positioned.column, positioned.columns, index),
                  )}
                  {ghost && ghostPiece
                    ? renderBlock({ occurrence: ghost.occurrence, ...ghostPiece }, 0, 1, 0, { ghost: true })
                    : null}
                  {ctx.nowIndicator && today && nowMinutes >= slotMin && nowMinutes <= slotMax ? (
                    <NowIndicator top={(nowMinutes - slotMin) * pxPerMinute} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
