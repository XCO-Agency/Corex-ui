import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import {
  getMonthMatrix,
  getMonthTitle,
  isDateInRange,
  isDateEqual,
  parseISODate,
  toISODateString,
} from "./datePickerUtils";
import { Button } from "../Button";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";

export type DatePickerCalendarPropsType = {
  startDate: string;
  endDate: string;
  onSelectDate: (dateStr: string) => void;
  className?: string;
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DatePickerCalendar({
  startDate,
  endDate,
  onSelectDate,
  className = "",
}: DatePickerCalendarPropsType) {
  // Determine initial view year/month from startDate or current date
  const initialDate = parseISODate(startDate) || new Date();

  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Month 1: viewYear, viewMonth
  // Month 2: month 1 + 1 month
  const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);
  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth();

  const handlePrev = (e: MouseEvent) => {
    console.log(typeof e);

    e.stopPropagation();
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  };

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const month1Days = getMonthMatrix(viewYear, viewMonth);
  const month2Days = getMonthMatrix(nextYear, nextMonth);

  // Effective range for highlighting (including hover if in middle of picking)
  const effectiveStart = startDate;
  let effectiveEnd = endDate;
  if (startDate && !endDate && hoverDate && hoverDate >= startDate) {
    effectiveEnd = hoverDate;
  }

  const renderMonth = (
    year: number,
    month: number,
    days: ReturnType<typeof getMonthMatrix>,
    isLeft: boolean,
  ) => {
    return (
      <div style={{ flex: 1, minWidth: "220px" }}>
        {/* Month Header */}
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          paddingBlockEnd="small-300"
        >
          {isLeft ? (
            <Button
              variant="tertiary"
              onClick={handlePrev}
              aria-label="Previous month"
              icon="arrow-left"
            />
          ) : (
            <div style={{ width: "28px" }} />
          )}

          <Text variant="headingSm">{getMonthTitle(year, month)}</Text>

          {!isLeft ? (
            <Button
              onClick={handleNext}
              aria-label="Next month"
              variant="tertiary"
              icon="arrow-right"
            />
          ) : (
            <div style={{ width: "28px" }} />
          )}
        </InlineStack>

        {/* Days of Week Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          {DAY_NAMES.map((d) => (
            <span
              key={d}
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--p-color-text-subdued, #6d7175)",
              }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            rowGap: "2px",
          }}
        >
          {days.map((item, idx) => {
            const isStart = isDateEqual(item.dateStr, effectiveStart);
            const isEnd = isDateEqual(item.dateStr, effectiveEnd);
            const inRange =
              effectiveStart &&
              effectiveEnd &&
              isDateInRange(item.dateStr, effectiveStart, effectiveEnd);

            const isCurrent = item.isCurrentMonth;

            // Background bridge for range selection
            const hasRangeBridge = inRange && isCurrent;

            return (
              <div
                key={idx}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "32px",
                  backgroundColor: hasRangeBridge
                    ? "var(--p-color-bg-surface-selected, #f1f2f3)"
                    : "transparent",
                  borderTopLeftRadius: isStart ? "8px" : "0",
                  borderBottomLeftRadius: isStart ? "8px" : "0",
                  borderTopRightRadius: isEnd ? "8px" : "0",
                  borderBottomRightRadius: isEnd ? "8px" : "0",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isCurrent) onSelectDate(item.dateStr);
                  }}
                  onMouseEnter={() => {
                    if (isCurrent) setHoverDate(item.dateStr);
                  }}
                  disabled={!isCurrent}
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: "none",
                    background: isEnd
                      ? "var(--p-color-bg-fill-brand-selected, #2c3136)"
                      : isStart
                        ? "var(--p-color-bg-fill-brand-selected, #303030)"
                        : "transparent",
                    color:
                      isEnd || isStart
                        ? "#ffffff"
                        : isCurrent
                          ? "var(--p-color-text, #202223)"
                          : "transparent",
                    // fontSize: "12px",
                    fontWeight: isStart || isEnd ? 600 : 400,
                    cursor: isCurrent ? "pointer" : "default",
                    position: "relative",
                    zIndex: 1,
                    transition: "transform 0.1s ease",
                  }}
                >
                  {isCurrent ? item.dayNumber : ""}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <InlineStack
      className={className}
      gap="base"
      paddingBlockStart="small-200"
      paddingBlockEnd="small"
      paddingInline="small"
    >
      {renderMonth(viewYear, viewMonth, month1Days, true)}
      {renderMonth(nextYear, nextMonth, month2Days, false)}
    </InlineStack>
  );
}
