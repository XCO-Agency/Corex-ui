import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useHydrated } from "../../core/useHydrated";
import { useIsomorphicLayoutEffect } from "../../core/useIsomorphicLayoutEffect";
import { mergeRefs } from "../../core/mergeRefs";
import { CALENDAR_CSS, CALENDAR_STYLE_ID } from "./Calendar.css";
import { COMPACT_BREAKPOINT, DENSITY_METRICS } from "./Calendar.constants";
import { CalendarContext } from "./Calendar.context";
import type {
  CalendarContextType,
  CalendarSelectionType,
  ResolvedBusinessHoursType,
} from "./Calendar.context";
import type {
  CalendarEventType,
  CalendarPropsType,
  CalendarRangeType,
  CalendarViewType,
} from "./Calendar.types";
import { useControllableState } from "./hooks/useControllableState";
import { useDragDrop } from "./hooks/useDragDrop";
import { useElementSize } from "./hooks/useElementSize";
import { useNow } from "./hooks/useNow";
import {
  addDays,
  addMonths,
  getMonthGrid,
  parseTimeToMinutes,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toDateKey,
} from "./utils/date";
import { compareOccurrences, occurrenceTouchesDay, resolveOccurrences } from "./utils/events";
import { formatTitle } from "./utils/format";
import { DEFAULT_TOOLBAR, Toolbar } from "./Toolbar";
import { DayEventsModal } from "./parts/DayEventsModal";
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";
import { DayView } from "./views/DayView";
import { ListView } from "./views/ListView";

const ALL_VIEWS: CalendarViewType[] = ["month", "week", "day", "list"];
const NO_EVENTS: CalendarEventType[] = [];

function ensureCalendarStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  if (!doc) return;
  const existing = doc.getElementById(CALENDAR_STYLE_ID);
  if (existing) {
    if (existing.textContent !== CALENDAR_CSS) existing.textContent = CALENDAR_CSS;
    return;
  }
  const style = doc.createElement("style");
  style.id = CALENDAR_STYLE_ID;
  style.textContent = CALENDAR_CSS;
  doc.head.appendChild(style);
}

/** Visible range for a view, end exclusive. */
export function getVisibleRange(
  view: CalendarViewType,
  date: Date,
  firstDay: number,
  fixedWeekCount = true,
): CalendarRangeType {
  if (view === "month") {
    const weeks = getMonthGrid(date, firstDay, fixedWeekCount);
    return { start: weeks[0]![0]!, end: addDays(weeks[weeks.length - 1]![6]!, 1) };
  }
  if (view === "list") {
    const start = startOfMonth(date);
    return { start, end: addMonths(start, 1) };
  }
  if (view === "week") {
    const start = startOfWeek(date, firstDay);
    return { start, end: addDays(start, 7) };
  }
  const start = startOfDay(date);
  return { start, end: addDays(start, 1) };
}

function resolveBusinessHours(
  value: CalendarPropsType["businessHours"],
): ResolvedBusinessHoursType | null {
  if (!value) return null;
  const config = value === true ? {} : value;
  return {
    daysOfWeek: config.daysOfWeek ?? [1, 2, 3, 4, 5],
    startMinutes: parseTimeToMinutes(config.startTime, 9 * 60),
    endMinutes: parseTimeToMinutes(config.endTime, 17 * 60),
  };
}

/**
 * FullCalendar-style event calendar with month, week, day and list views.
 *
 * ```tsx
 * <Calendar
 *   events={[{ id: "1", title: "Launch", start: "2026-10-21", allDay: true }]}
 *   editable
 *   selectable
 *   onEventDrop={({ event, newStart, newEnd }) => save(event.id, newStart, newEnd)}
 * />
 * ```
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarPropsType>(function Calendar(
  {
    events: eventsSource,
    view: viewProp,
    defaultView,
    onViewChange,
    date: dateProp,
    defaultDate,
    onDatesChange,
    firstDay = 0,
    locale,
    weekends = true,
    weekNumbers = false,
    dayMaxEvents = 3,
    fixedWeekCount = true,
    editable = false,
    selectable = false,
    nowIndicator = true,
    slotMinTime,
    slotMaxTime,
    slotDuration = 30,
    businessHours: businessHoursProp,
    height = "auto",
    headerToolbar,
    density = "comfortable",
    dir = "ltr",
    views = ALL_VIEWS,
    onDateClick,
    onEventClick,
    onSelect,
    onEventDrop,
    onEventResize,
    renderEvent,
    renderDayCell,
    label = "Calendar",
    classNames = {},
    className,
    style,
    id,
  },
  ref,
) {
  const hydrated = useHydrated();
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMemo(() => mergeRefs(ref, rootRef), [ref]);
  const titleId = `${useId().replace(/:/g, "")}-calendar-title`;

  useIsomorphicLayoutEffect(() => {
    ensureCalendarStyles(rootRef.current);
  }, []);

  const [view, setViewState] = useControllableState<CalendarViewType>(
    viewProp,
    defaultView ?? "month",
    onViewChange,
  );
  const [date, setDateState] = useControllableState<Date>(
    dateProp,
    defaultDate ?? new Date(),
  );
  const [focusDate, setFocusDate] = useState<Date>(() => startOfDay(dateProp ?? defaultDate ?? new Date()));
  const pendingFocusRef = useRef(false);
  const [selection, setSelection] = useState<CalendarSelectionType | null>(null);
  // The date outlives `open` so the modal keeps its content while it animates closed.
  const [dayListDate, setDayListDate] = useState<Date | null>(null);
  const [dayListOpen, setDayListOpen] = useState(false);
  const [anim, setAnim] = useState<"next" | "prev" | "view" | null>(null);
  const [pulseToday, setPulseToday] = useState(false);

  const now = useNow(hydrated);
  const today = useMemo(() => startOfDay(now), [now.toDateString()]); // eslint-disable-line react-hooks/exhaustive-deps

  const rootSize = useElementSize(rootRef);
  const compact = Boolean(rootSize && rootSize.width > 0 && rootSize.width < COMPACT_BREAKPOINT);

  // On a phone, an uncontrolled calendar with no explicit view opens as a list.
  const checkedMobile = useRef(false);
  useEffect(() => {
    if (checkedMobile.current || !hydrated) return;
    checkedMobile.current = true;
    if (viewProp !== undefined || defaultView !== undefined || !views.includes("list")) return;
    const view = rootRef.current?.ownerDocument.defaultView;
    if (view && typeof view.matchMedia === "function" && view.matchMedia(`(max-width: ${COMPACT_BREAKPOINT - 1}px)`).matches) {
      setViewState("list");
    }
  }, [hydrated, viewProp, defaultView, views, setViewState]);

  const dateKey = toDateKey(date);
  const range = useMemo(
    () => getVisibleRange(view, date, firstDay, fixedWeekCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [view, dateKey, firstDay, fixedWeekCount],
  );
  const rangeKey = `${toDateKey(range.start)}_${toDateKey(range.end)}`;

  // Events: a plain array, or a loader called with each new visible range.
  const [fetched, setFetched] = useState<CalendarEventType[]>(NO_EVENTS);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);
  useEffect(() => {
    if (typeof eventsSource !== "function" || !hydrated) return;
    const request = ++requestRef.current;
    setLoading(true);
    eventsSource(range)
      .then((result) => {
        if (request === requestRef.current) setFetched(result);
      })
      .catch(() => {
        // Keep the previous events; the host owns error reporting.
      })
      .finally(() => {
        if (request === requestRef.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsSource, rangeKey, hydrated]);
  const rawEvents = typeof eventsSource === "function" ? fetched : eventsSource;

  const { overrides, settling, commitMove, commitResize } = useDragDrop(eventsSource, {
    onEventDrop,
    onEventResize,
  });

  const occurrences = useMemo(() => {
    const effective = rawEvents.map((event) => {
      const override = overrides[event.id];
      return override ? { ...event, ...override } : event;
    });
    return resolveOccurrences(effective, range).sort(compareOccurrences);
  }, [rawEvents, overrides, range]);

  const onDatesChangeRef = useRef(onDatesChange);
  onDatesChangeRef.current = onDatesChange;
  useEffect(() => {
    if (!hydrated) return;
    onDatesChangeRef.current?.({ ...range, view, date });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKey, view, hydrated]);

  useEffect(() => {
    setSelection(null);
    setDayListOpen(false);
  }, [rangeKey, view]);

  const gotoDate = useCallback(
    (next: Date) => {
      setDateState(next);
      setFocusDate(startOfDay(next));
    },
    [setDateState],
  );

  const navigate = (direction: 1 | -1) => {
    const next =
      view === "month" || view === "list"
        ? addMonths(date, direction)
        : addDays(date, view === "week" ? 7 * direction : direction);
    setAnim(direction === 1 ? "next" : "prev");
    gotoDate(next);
  };

  const goToday = () => {
    const todayDate = new Date();
    const before = startOfDay(todayDate) < range.start;
    const after = startOfDay(todayDate) >= range.end;
    if (before || after) setAnim(after ? "next" : "prev");
    gotoDate(todayDate);
    setPulseToday(false);
    // Restart the pulse on the next frame so repeated clicks replay it.
    requestAnimationFrame(() => setPulseToday(true));
  };
  useEffect(() => {
    if (!pulseToday) return undefined;
    const timer = window.setTimeout(() => setPulseToday(false), 700);
    return () => window.clearTimeout(timer);
  }, [pulseToday]);

  const changeView = useCallback(
    (next: CalendarViewType) => {
      setAnim("view");
      setViewState(next);
    },
    [setViewState],
  );

  const openDayList = useCallback((day: Date) => {
    setDayListDate(day);
    setDayListOpen(true);
  }, []);

  const handlersRef = useRef({ onDateClick, onEventClick, onSelect });
  handlersRef.current = { onDateClick, onEventClick, onSelect };
  const fireDateClick = useCallback<CalendarContextType["fireDateClick"]>(
    (info) => handlersRef.current.onDateClick?.(info),
    [],
  );
  const fireEventClick = useCallback<CalendarContextType["fireEventClick"]>(
    (info) => handlersRef.current.onEventClick?.(info),
    [],
  );
  const fireSelect = useCallback<CalendarContextType["fireSelect"]>(
    (info) => handlersRef.current.onSelect?.(info),
    [],
  );

  const resolvedDirection = dir === "auto" ? (rootRef.current?.closest("[dir]")?.getAttribute("dir") === "rtl" ? "rtl" : "ltr") : dir;
  const metrics = DENSITY_METRICS[density];
  const slotMinMinutes = parseTimeToMinutes(slotMinTime, 0);
  const slotMaxMinutes = Math.max(slotMinMinutes + slotDuration, parseTimeToMinutes(slotMaxTime, 24 * 60));
  const businessHours = useMemo(
    () => resolveBusinessHours(businessHoursProp),
    // Object literals are common here; compare by value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(businessHoursProp)],
  );

  const contextValue: CalendarContextType = {
    titleId,
    view,
    date,
    today,
    now,
    locale,
    firstDay,
    direction: resolvedDirection,
    weekends,
    weekNumbers,
    dayMaxEvents,
    fixedWeekCount,
    editable,
    selectable,
    nowIndicator,
    slotMinMinutes,
    slotMaxMinutes,
    slotDuration: Math.max(5, slotDuration),
    businessHours,
    compact,
    fixedHeight: typeof height === "number",
    metrics,
    occurrences,
    settling,
    classNames,
    renderEvent,
    renderDayCell,
    focusDate,
    pendingFocusRef,
    setFocusDate,
    selection,
    setSelection,
    pulseToday,
    gotoDate,
    changeView,
    openDayList,
    fireDateClick,
    fireEventClick,
    fireSelect,
    commitMove,
    commitResize,
  };

  const title = hydrated ? formatTitle(view, date, range.start, range.end, locale) : "";

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
    const target = event.target as HTMLElement;
    if (target.closest("s-modal")) return;
    if (event.key === "Escape" && selection) {
      setSelection(null);
      return;
    }
    if (view === "month") return; // the month grid handles its own keys
    if (event.key === "t" || event.key === "T") {
      event.preventDefault();
      goToday();
    } else if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      navigate(event.key === "PageDown" ? 1 : -1);
    }
  };

  const rootStyle = {
    "--cx-cal-lane-h": `${metrics.laneHeight}px`,
    "--cx-cal-daynum-h": `${metrics.dayNumberHeight}px`,
    ...(typeof height === "number" ? { height } : null),
    ...style,
  } as CSSProperties;

  const dayListOccurrences = dayListDate
    ? occurrences.filter((occurrence) => occurrenceTouchesDay(occurrence, dayListDate))
    : [];

  const ViewComponent =
    view === "week" ? WeekView : view === "day" ? DayView : view === "list" ? ListView : MonthView;

  return (
    <div
      ref={mergedRef}
      id={id}
      role="region"
      aria-label={label}
      aria-busy={loading || undefined}
      dir={resolvedDirection}
      data-slot="calendar"
      data-view={view}
      data-density={density}
      className={[className, classNames.root].filter(Boolean).join(" ") || undefined}
      style={rootStyle}
      onKeyDown={handleKeyDown}
    >
      <div id={titleId} data-slot="calendar-sr" aria-live="polite" aria-atomic="true">
        {title}
      </div>
      {hydrated ? (
        <CalendarContext.Provider value={contextValue}>
          {headerToolbar === false ? null : (
            <Toolbar
              config={headerToolbar ?? DEFAULT_TOOLBAR}
              title={title}
              view={view}
              views={views}
              direction={resolvedDirection}
              className={classNames.toolbar}
              titleClassName={classNames.title}
              onPrev={() => navigate(-1)}
              onNext={() => navigate(1)}
              onToday={goToday}
              onView={changeView}
            />
          )}
          <div
            key={`${view}:${rangeKey}`}
            data-slot="calendar-view"
            data-anim={anim ?? undefined}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) setAnim(null);
            }}
          >
            <ViewComponent />
          </div>
          <DayEventsModal
            open={dayListOpen}
            date={dayListDate}
            occurrences={dayListOccurrences}
            direction={resolvedDirection}
            onClose={() => setDayListOpen(false)}
          />
        </CalendarContext.Provider>
      ) : null}
    </div>
  );
});

