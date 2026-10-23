import { createContext, useContext } from "react";
import type { MutableRefObject, ReactNode } from "react";
import type { DensityMetricsType } from "./Calendar.constants";
import type {
  CalendarClassNamesType,
  CalendarDateClickInfoType,
  CalendarEventChangeInfoType,
  CalendarEventClickInfoType,
  CalendarOccurrenceType,
  CalendarRenderDayCellInfoType,
  CalendarRenderEventInfoType,
  CalendarSelectInfoType,
  CalendarViewType,
} from "./Calendar.types";

export type CalendarSelectionType = {
  start: Date;
  /** Exclusive. */
  end: Date;
  allDay: boolean;
};

export type ResolvedBusinessHoursType = {
  daysOfWeek: number[];
  startMinutes: number;
  endMinutes: number;
};

export type CalendarContextType = {
  /** Id of the element holding the visible title, for `aria-labelledby`. */
  titleId: string;
  view: CalendarViewType;
  date: Date;
  today: Date;
  now: Date;
  locale: string | undefined;
  firstDay: number;
  direction: "ltr" | "rtl";
  weekends: boolean;
  weekNumbers: boolean;
  dayMaxEvents: number | boolean;
  fixedWeekCount: boolean;
  editable: boolean;
  selectable: boolean;
  nowIndicator: boolean;
  slotMinMinutes: number;
  slotMaxMinutes: number;
  slotDuration: number;
  businessHours: ResolvedBusinessHoursType | null;
  /** True below ~640px: month events collapse to dots and a tap opens the day's events. */
  compact: boolean;
  /** True when `height` is a number, so views fill and scroll inside the box. */
  fixedHeight: boolean;
  metrics: DensityMetricsType;
  occurrences: CalendarOccurrenceType[];
  settling: ReadonlySet<string>;
  classNames: CalendarClassNamesType;
  renderEvent?: (info: CalendarRenderEventInfoType) => ReactNode;
  renderDayCell?: (info: CalendarRenderDayCellInfoType) => ReactNode;

  focusDate: Date;
  /** Set before a keyboard move; the (possibly remounted) month grid focuses `focusDate` and clears it. */
  pendingFocusRef: MutableRefObject<boolean>;
  setFocusDate: (date: Date) => void;
  selection: CalendarSelectionType | null;
  setSelection: (selection: CalendarSelectionType | null) => void;
  pulseToday: boolean;

  gotoDate: (date: Date) => void;
  changeView: (view: CalendarViewType) => void;
  openDayList: (date: Date) => void;

  fireDateClick: (info: CalendarDateClickInfoType) => void;
  fireEventClick: (info: CalendarEventClickInfoType) => void;
  fireSelect: (info: CalendarSelectInfoType) => void;
  commitMove: (info: CalendarEventChangeInfoType) => void;
  commitResize: (info: CalendarEventChangeInfoType) => void;
};

export const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendarContext(): CalendarContextType {
  const value = useContext(CalendarContext);
  if (!value) throw new Error("Calendar parts must be rendered inside <Calendar>.");
  return value;
}
