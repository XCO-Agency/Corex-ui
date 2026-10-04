import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { formatDateDisplay, toISODateString } from "./datePickerUtils";
import { Button } from "../Button";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { Icon } from "../Icon";
import { Box } from "../Box";
import { TextField } from "../TextField";

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

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      tryParseAndCommit();
    }
  };

  return (
    <BlockStack gap="small-200" padding="small-200" className={className}>
      {/* Date Row */}
      <InlineStack alignItems="center" gap="small-200">
        <InlineStack grow>
          <TextField
            value={startText}
            icon="calendar"
            onChange={(val) => setStartText(val)}
            onBlur={tryParseAndCommit}
            onInput={handleKeyDown}
            placeholder="Start date"
            labelAccessibilityVisibility="exclusive"
          />
        </InlineStack>

        <Icon type="arrow-right" />

        <InlineStack grow>
          <TextField
            value={endText}
            icon="calendar"
            onChange={(val) => setEndText(val)}
            onBlur={tryParseAndCommit}
            onInput={handleKeyDown}
            placeholder="End date"
            labelAccessibilityVisibility="exclusive"
          />
        </InlineStack>

        {/* Clock icon toggles the time row */}
        <Button
          icon="clock"
          variant={timeEnabled ? "primary" : "tertiary"}
          onClick={() => setTimeEnabled((prev) => !prev)}
        />
      </InlineStack>

      {/* Time Row - hidden until time is enabled */}
      {timeEnabled && (
        <InlineStack alignItems="center" gap="small-200">
          <InlineStack flex={1}>
            <TextField
              value={startTime}
              onChange={(val) => setStartTime(val)}
              placeholder="00:00"
              icon="clock"
              labelAccessibilityVisibility="exclusive"
            />
          </InlineStack>

          <Icon type="arrow-right" />

          <InlineStack flex={1}>
            <TextField
              value={endTime}
              onChange={(val) => setEndTime(val)}
              placeholder="23:59"
              icon="clock"
              labelAccessibilityVisibility="exclusive"
            />
          </InlineStack>
          <div style={{ inlineSize: "28px" }} />
        </InlineStack>
      )}
    </BlockStack>
  );
}
