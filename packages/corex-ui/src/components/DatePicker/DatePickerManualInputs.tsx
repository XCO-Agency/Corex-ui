import { useState, useEffect } from "react";
import type { CSSProperties, ChangeEvent, FocusEvent, KeyboardEvent } from "react";
import { formatDateDisplay, parseISODate, toISODateString } from "./datePickerUtils";
import { Button } from "../Button";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { Icon } from "../Icon";

export type DatePickerManualInputsPropsType = {
  startDate: string;
  endDate: string;
  onChangeRange: (range: { start: string; end: string }) => void;
  /** Earliest selectable date (inclusive), as an ISO date string. */
  minDate?: string;
  /** Latest selectable date (inclusive), as an ISO date string. Defaults to today. */
  maxDate?: string;
  className?: string;
};

function clampDate(dateStr: string, minDate?: string, maxDate?: string): string {
  if (minDate && dateStr < minDate) return minDate;
  if (maxDate && dateStr > maxDate) return maxDate;
  return dateStr;
}

export function DatePickerManualInputs({
  startDate,
  endDate,
  onChangeRange,
  minDate,
  maxDate,
  className = "",
}: DatePickerManualInputsPropsType) {
  const [startText, setStartText] = useState(formatDateDisplay(startDate));
  const [endText, setEndText] = useState(formatDateDisplay(endDate));
  // Requirement 3: time inputs are disabled/hidden by default, only shown once enabled.
  const [timeEnabled, setTimeEnabled] = useState(false);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  useEffect(() => {
    setStartText(formatDateDisplay(startDate));
  }, [startDate]);

  useEffect(() => {
    setEndText(formatDateDisplay(endDate));
  }, [endDate]);

  const tryParseAndCommit = () => {
    const dStart = new Date(startText);
    const dEnd = new Date(endText);

    if (!isNaN(dStart.getTime()) && !isNaN(dEnd.getTime())) {
      const rawStart = toISODateString(dStart);
      const rawEnd = toISODateString(dEnd);
      const [orderedStart, orderedEnd] =
        rawStart <= rawEnd ? [rawStart, rawEnd] : [rawEnd, rawStart];

      onChangeRange({
        start: clampDate(orderedStart, minDate, maxDate),
        end: clampDate(orderedEnd, minDate, maxDate),
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      tryParseAndCommit();
    }
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    height: "28px",
    padding: "6px 12px",
    fontSize: "13px",
    lineHeight: "20px",
    backgroundColor: "var(--p-color-bg-surface, #fff)",
    border: "0.5px solid var(--p-color-border-subdue, #c9cccf)",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  const timeInputStyle: CSSProperties = {
    ...inputStyle,
    flex: "1",
    width: "132px",
    paddingLeft: "32px",
  };

  const timeIconStyle: CSSProperties = {
    position: "absolute",
    left: "6px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.boxShadow = "0 0 0 2px var(--p-color-border-focus, #005bd3)";
  };

  const handleBlurCapture = (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <BlockStack gap="small-300" padding="small" className={className}>
      {/* Date Row */}
      <InlineStack alignItems="center" gap="small">
        <input
          type="text"
          inputMode="numeric"
          value={startText}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setStartText(e.target.value)}
          onBlur={tryParseAndCommit}
          onKeyDown={handleKeyDown}
          placeholder="Start date"
          aria-label="Start date"
          style={inputStyle}
          onFocus={handleFocus}
          onBlurCapture={handleBlurCapture}
        />

        <Icon type="arrow-right" />

        <input
          type="text"
          value={endText}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEndText(e.target.value)}
          onBlur={tryParseAndCommit}
          onKeyDown={handleKeyDown}
          placeholder="End date"
          aria-label="End date"
          style={inputStyle}
          onFocus={handleFocus}
          onBlurCapture={handleBlurCapture}
        />

        {/* Clock icon toggles the time row (disabled by default, shown once enabled) */}
        <Button
          aria-label={timeEnabled ? "Hide time" : "Show time"}
          aria-pressed={timeEnabled}
          icon="clock"
          variant={timeEnabled ? "primary" : "secondary"}
          onClick={() => setTimeEnabled((prev) => !prev)}
        />
      </InlineStack>

      {/* Time Row - hidden until time is enabled */}
      {timeEnabled && (
        <InlineStack alignItems="center" gap="small">
          <span style={{ position: "relative", display: "flex", flex: 1 }}>
            <span style={timeIconStyle}>
              <Icon type="clock" />
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={startTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartTime(e.target.value)
              }
              placeholder="00:00"
              aria-label="Start time"
              style={timeInputStyle}
              onFocus={handleFocus}
              onBlurCapture={handleBlurCapture}
            />
          </span>

          <Icon type="arrow-right" />

          <span style={{ position: "relative", display: "flex", flex: 1 }}>
            <span style={timeIconStyle}>
              <Icon type="clock" />
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={endTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
              placeholder="23:59"
              aria-label="End time"
              style={timeInputStyle}
              onFocus={handleFocus}
              onBlurCapture={handleBlurCapture}
            />
          </span>
          <span style={{ width: 28 }}></span>
        </InlineStack>
      )}
    </BlockStack>
  );
}
