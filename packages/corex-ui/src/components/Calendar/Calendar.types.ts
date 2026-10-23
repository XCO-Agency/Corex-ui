import type { CSSProperties, ReactNode } from "react";

export type CalendarViewType = "month" | "week" | "day" | "list";

export type CalendarDensityType = "comfortable" | "compact";

export type CalendarDirectionType = "ltr" | "rtl" | "auto";

export type CalendarEventType = {
  id: string;
  title: string;
  /** `Date`, ISO datetime, or date-only string (`"2026-10-21"`, read as local midnight). */
  start: Date | string;
  /**
   * End of the event. For all-day events the end is exclusive (an event on
   * Oct 21–22 ends `"2026-10-23"`), matching FullCalendar. Omitted: all-day
   * events last one day and timed events one hour.
   */
  end?: Date | string;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  /** Overrides the calendar-level `editable` for this event. */
  editable?: boolean;
  /** Recurrence rule, e.g. `"FREQ=WEEKLY;BYDAY=MO,WE;COUNT=10"`. */
  rrule?: string;
  extendedProps?: Record<string, unknown>;
};

export type CalendarRangeType = {
  start: Date;
  /** Exclusive. */
  end: Date;
};

export type CalendarEventsSourceType =
  | CalendarEventType[]
  | ((range: CalendarRangeType) => Promise<CalendarEventType[]>);

export type CalendarBusinessHoursType = {
  /** 0 = Sunday. Defaults to Monday–Friday. */
  daysOfWeek?: number[];
  /** `"HH:mm"`, default `"09:00"`. */
  startTime?: string;
  /** `"HH:mm"`, default `"17:00"`. */
  endTime?: string;
};

export type CalendarHeaderToolbarType = {
  /** Tokens: `prev`, `next`, `today`, `title`, `month`, `week`, `day`, `list`. A comma joins buttons, a space separates groups. */
  start?: string;
  center?: string;
  end?: string;
};

export type CalendarDateClickInfoType = {
  date: Date;
  allDay: boolean;
};

export type CalendarSelectInfoType = {
  start: Date;
  /** Exclusive. */
  end: Date;
  allDay: boolean;
};

export type CalendarEventClickInfoType = {
  event: CalendarEventType;
  /** Start of the clicked occurrence (differs from `event.start` for recurring events). */
  start: Date;
  end: Date;
  nativeEvent: { target: EventTarget | null };
};

export type CalendarEventChangeInfoType = {
  event: CalendarEventType;
  oldStart: Date;
  oldEnd: Date;
  newStart: Date;
  newEnd: Date;
  allDay: boolean;
};

/** Return `false` (or reject) to revert the change. */
export type CalendarEventChangeResultType = void | boolean | Promise<void | boolean>;

export type CalendarDatesChangeInfoType = CalendarRangeType & {
  view: CalendarViewType;
  date: Date;
};

export type CalendarRenderEventInfoType = {
  event: CalendarEventType;
  start: Date;
  end: Date;
  allDay: boolean;
  view: CalendarViewType;
  timeText: string;
};

export type CalendarRenderDayCellInfoType = {
  date: Date;
  isToday: boolean;
  isOutside: boolean;
  view: CalendarViewType;
};

export type CalendarClassNamesType = Partial<
  Record<
    "root" | "toolbar" | "title" | "grid" | "dayCell" | "event" | "popover" | "timeGrid",
    string
  >
>;

export type CalendarPropsType = {
  events: CalendarEventsSourceType;

  view?: CalendarViewType;
  defaultView?: CalendarViewType;
  onViewChange?: (view: CalendarViewType) => void;

  date?: Date;
  defaultDate?: Date;
  onDatesChange?: (info: CalendarDatesChangeInfoType) => void;

  /** First day of the week, 0 = Sunday. Default `0`. */
  firstDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  weekends?: boolean;
  weekNumbers?: boolean;
  /** Month view: max rows of events per day before "+N more". `true` fits the cell height. */
  dayMaxEvents?: number | boolean;
  /** Month view: always render six weeks. Default `true`. */
  fixedWeekCount?: boolean;

  editable?: boolean;
  selectable?: boolean;
  nowIndicator?: boolean;

  /** `"HH:mm"`, default `"00:00"`. */
  slotMinTime?: string;
  /** `"HH:mm"`, default `"24:00"`. */
  slotMaxTime?: string;
  /** Minutes per slot, default `30`. */
  slotDuration?: number;
  businessHours?: boolean | CalendarBusinessHoursType;

  /** Pixels for a scrolling calendar, or `"auto"` (default) to size to content. */
  height?: number | "auto";
  /** `false` hides the toolbar. */
  headerToolbar?: false | CalendarHeaderToolbarType;
  density?: CalendarDensityType;
  dir?: CalendarDirectionType;
  /** Views offered by the default toolbar tokens. Default: all four. */
  views?: CalendarViewType[];

  onDateClick?: (info: CalendarDateClickInfoType) => void;
  onEventClick?: (info: CalendarEventClickInfoType) => void;
  onSelect?: (info: CalendarSelectInfoType) => void;
  onEventDrop?: (info: CalendarEventChangeInfoType) => CalendarEventChangeResultType;
  onEventResize?: (info: CalendarEventChangeInfoType) => CalendarEventChangeResultType;

  renderEvent?: (info: CalendarRenderEventInfoType) => ReactNode;
  renderDayCell?: (info: CalendarRenderDayCellInfoType) => ReactNode;

  /** Label for the calendar region. */
  label?: string;
  classNames?: CalendarClassNamesType;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/** An event occurrence resolved to concrete dates inside the visible range. */
export type CalendarOccurrenceType = {
  key: string;
  event: CalendarEventType;
  start: Date;
  /** Exclusive for all-day occurrences. */
  end: Date;
  allDay: boolean;
};
