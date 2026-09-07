import { useState, useEffect } from "react";
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
import { Grid } from "../Grid";
import { Clickable } from "../Clickable";

export type DatePickerCalendarPropsType = {
  startDate: string;
  endDate: string;
  onSelectDate: (dateStr: string) => void;
  viewDate?: string;
  className?: string;
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DatePickerCalendar({
  startDate,
  endDate,
  onSelectDate,
  viewDate,
  className = "",
}: DatePickerCalendarPropsType) {
  // Determine initial view year/month from viewDate, startDate or current date
  const getTargetDate = (val?: string) => {
    return (val ? parseISODate(val) : null) || new Date();
  };

  const initialDate = getTargetDate(viewDate || startDate);

  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Sync calendar view when viewDate changes (e.g. preset clicked or date selected)
  useEffect(() => {
    if (viewDate) {
      const parsed = parseISODate(viewDate);
      if (parsed) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
  }, [viewDate]);

  // If viewDate is not explicitly passed, sync when startDate changes if outside current view
  useEffect(() => {
    if (!viewDate && startDate) {
      const parsed = parseISODate(startDate);
      if (parsed) {
        const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);
        const inMonth1 =
          parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth;
        const inMonth2 =
          parsed.getFullYear() === nextMonthDate.getFullYear() &&
          parsed.getMonth() === nextMonthDate.getMonth();

        if (!inMonth1 && !inMonth2) {
          setViewYear(parsed.getFullYear());
          setViewMonth(parsed.getMonth());
        }
      }
    }
  }, [startDate, viewDate, viewYear, viewMonth]);

  // Month 1: viewYear, viewMonth
  // Month 2: month 1 + 1 month
  const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);
  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth();

  const handlePrev = (e?: any) => {
    e?.stopPropagation?.();
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  };

  const handleNext = (e?: any) => {
    e?.stopPropagation?.();
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

          <Text heading>{getMonthTitle(year, month)}</Text>

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
        <Grid columns={7} columnGap="small-500" justifyItems="center">
          {DAY_NAMES.map((d) => (
            <Text key={d} variant="xs">
              {d}
            </Text>
          ))}
        </Grid>

        {/* Days Grid */}
        <Grid columns={7} columnGap="none" rowGap="small-500">
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
                  width: "32px",
                  backgroundColor: hasRangeBridge
                    ? "var(--p-color-bg-surface-selected, #f1f2f3)"
                    : "transparent",
                  borderTopLeftRadius: isStart ? "8px" : "0",
                  borderBottomLeftRadius: isStart ? "8px" : "0",
                  borderTopRightRadius: isEnd ? "8px" : "0",
                  borderBottomRightRadius: isEnd ? "8px" : "0",
                }}
              >
                {isCurrent ? (
                  <Button
                    type="button"
                    onClick={() => onSelectDate(item.dateStr)}
                    variant={isEnd || isStart ? "primary" : "tertiary"}
                  >
                    <span
                      style={{
                        marginInline: -4,
                        width: 14,
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        height: 18,
                      }}
                    >
                      {item.dayNumber}
                    </span>
                  </Button>
                ) : (
                  <span
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      opacity: 0.3,
                      height: 28,
                      width: 28,
                      borderRadius: 8,
                    }}
                  >
                    -
                  </span>
                )}
              </div>
            );
          })}
        </Grid>
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
