import type { DatePresetItemType, DateRangeType } from "./DatePicker.types";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = padZero(date.getMonth() + 1);
  const d = padZero(date.getDate());
  return `${y}-${m}-${d}`;
}

export function parseISODate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0]!) || isNaN(parts[1]!) || isNaN(parts[2]!)) {
    return null;
  }
  return new Date(parts[0]!, parts[1]! - 1, parts[2]!);
}

export function formatDateDisplay(dateStr: string): string {
  const d = parseISODate(dateStr);
  if (!d) return dateStr || "";
  const day = d.getDate();
  const monthName = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export function formatDateShort(dateStr: string): string {
  const d = parseISODate(dateStr);
  if (!d) return dateStr || "";
  const day = d.getDate();
  const monthShort = MONTH_NAMES_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${monthShort} ${year}`;
}

export function formatRangeDisplay(range: DateRangeType): string {
  if (!range.start && !range.end) return "Select date";
  if (range.start && !range.end) return formatDateShort(range.start);
  if (!range.start && range.end) return formatDateShort(range.end);
  if (range.start === range.end) return formatDateShort(range.start);

  const startDate = parseISODate(range.start);
  const endDate = parseISODate(range.end);
  if (!startDate || !endDate) return `${range.start} – ${range.end}`;

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const startDay = startDate.getDate();
  const startMonth = MONTH_NAMES_SHORT[startDate.getMonth()];
  const endDay = endDate.getDate();
  const endMonth = MONTH_NAMES_SHORT[endDate.getMonth()];
  const year = endDate.getFullYear();

  if (sameYear) {
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDay}–${endDay} ${startMonth} ${year}`;
    }
    return `${startDay} ${startMonth}–${endDay} ${endMonth} ${year}`;
  }
  return `${startDay} ${startMonth} ${startDate.getFullYear()}–${endDay} ${endMonth} ${year}`;
}

export function isDateInRange(
  dateStr: string,
  startStr?: string,
  endStr?: string,
): boolean {
  if (!startStr || !endStr) return false;
  return dateStr >= startStr && dateStr <= endStr;
}

export function isDateEqual(date1?: string, date2?: string): boolean {
  if (!date1 || !date2) return false;
  return date1 === date2;
}

export type DayMatrixItemType = {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

/**
 * Returns grid of days for a given year & month (0-indexed).
 * Week starts on Monday (0) through Sunday (6).
 */
export function getMonthMatrix(year: number, month: number): DayMatrixItemType[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Monday = 0, Sunday = 6 in European/Shopify ISO standard
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const totalDays = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days: DayMatrixItemType[] = [];
  const todayStr = toISODateString(new Date());

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDay = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, prevDay);
    const dateStr = toISODateString(prevDate);
    days.push({
      dateStr,
      dayNumber: prevDay,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const currDate = new Date(year, month, d);
    const dateStr = toISODateString(currDate);
    days.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month leading days (to fill complete weeks or minimum 35/42 slots)
  const remainder = days.length % 7;
  const paddingNeeded = remainder === 0 ? 0 : 7 - remainder;
  for (let nextD = 1; nextD <= paddingNeeded; nextD++) {
    const nextDate = new Date(year, month + 1, nextD);
    const dateStr = toISODateString(nextDate);
    days.push({
      dateStr,
      dayNumber: nextD,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

export function getMonthTitle(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/**
 * Generates default presets based on reference date (defaults to current date).
 */
export function getDefaultPresets(referenceDate: Date = new Date()): DatePresetItemType[] {
  const ref = new Date(referenceDate);
  const todayStr = toISODateString(ref);

  const yest = new Date(ref);
  yest.setDate(ref.getDate() - 1);
  const yesterdayStr = toISODateString(yest);

  // Week to date (Monday to today)
  const currentDayOfWeek = ref.getDay();
  const diffToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() - diffToMonday);
  const mondayStr = toISODateString(monday);

  // Month to date (1st of month to today)
  const firstOfMonth = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const firstOfMonthStr = toISODateString(firstOfMonth);

  // Quarter to date
  const currentQuarter = Math.floor(ref.getMonth() / 3);
  const firstOfQuarter = new Date(ref.getFullYear(), currentQuarter * 3, 1);
  const firstOfQuarterStr = toISODateString(firstOfQuarter);

  // Year to date (Jan 1 to today)
  const firstOfYear = new Date(ref.getFullYear(), 0, 1);
  const firstOfYearStr = toISODateString(firstOfYear);

  // Last Quarter
  const lastQuarterStart = new Date(
    ref.getFullYear(),
    (currentQuarter - 1) * 3,
    1,
  );
  const lastQuarterEnd = new Date(ref.getFullYear(), currentQuarter * 3, 0);
  const lastQuarterRange: DateRangeType = {
    start: toISODateString(lastQuarterStart),
    end: toISODateString(lastQuarterEnd),
  };

  return [
    {
      id: "today",
      label: "Today",
      range: { start: todayStr, end: todayStr },
    },
    {
      id: "yesterday",
      label: "Yesterday",
      range: { start: yesterdayStr, end: yesterdayStr },
    },
    {
      id: "last_quarter",
      label: "Last quarter",
      range: lastQuarterRange,
    },
    {
      id: "period_to_date",
      label: "Period to date",
      children: [
        {
          id: "week_to_date",
          label: "Week to date",
          range: { start: mondayStr, end: todayStr },
        },
        {
          id: "month_to_date",
          label: "Month to date",
          range: { start: firstOfMonthStr, end: todayStr },
        },
        {
          id: "quarter_to_date",
          label: "Quarter to date",
          range: { start: firstOfQuarterStr, end: todayStr },
        },
        {
          id: "year_to_date",
          label: "Year to date",
          range: { start: firstOfYearStr, end: todayStr },
        },
      ],
    },
    {
      id: "bfcm",
      label: "Black Friday Cyber Monday",
      range: {
        start: `${ref.getFullYear()}-11-27`,
        end: `${ref.getFullYear()}-11-30`,
      },
    },
    {
      id: "quarters",
      label: "Quarters",
      children: [
        {
          id: "q1",
          label: "Q1",
          range: {
            start: `${ref.getFullYear()}-01-01`,
            end: `${ref.getFullYear()}-03-31`,
          },
        },
        {
          id: "q2",
          label: "Q2",
          range: {
            start: `${ref.getFullYear()}-04-01`,
            end: `${ref.getFullYear()}-06-30`,
          },
        },
        {
          id: "q3",
          label: "Q3",
          range: {
            start: `${ref.getFullYear()}-07-01`,
            end: `${ref.getFullYear()}-09-30`,
          },
        },
        {
          id: "q4",
          label: "Q4",
          range: {
            start: `${ref.getFullYear()}-10-01`,
            end: `${ref.getFullYear()}-12-31`,
          },
        },
      ],
    },
    {
      id: "custom",
      label: "Custom range",
    },
  ];
}
