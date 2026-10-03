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

  const handleKeyDown = (e: KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      tryParseAndCommit();
    }
  };

  return (
    <BlockStack gap="small-300" padding="small-200" className={className}>
      {/* Date Row */}
      <InlineStack alignItems="center" gap="small-200">
        <InlineStack grow>
          <TextField
            inputMode="numeric"
            value={startText}
            onChange={(val) => setStartText(val)}
            onBlur={tryParseAndCommit}
            onKeyDown={handleKeyDown}
            placeholder="Start date"
            accessibilityLabel="Start date"
          />
        </InlineStack>

        <Icon type="arrow-right" />

        <InlineStack grow>
          <TextField
            value={endText}
            onChange={(val) => setEndText(val)}
            onBlur={tryParseAndCommit}
            onKeyDown={handleKeyDown}
            placeholder="End date"
            accessibilityLabel="End date"
          />
        </InlineStack>

        {/* Clock icon toggles the time row */}
        <Button
          accessibilityLabel={timeEnabled ? "Hide time" : "Show time"}
          icon="clock"
          variant={timeEnabled ? "primary" : "secondary"}
          onClick={() => setTimeEnabled((prev) => !prev)}
        />
      </InlineStack>

      {/* Time Row - hidden until time is enabled */}
      {timeEnabled && (
        <InlineStack alignItems="center" gap="small-200">
          <InlineStack grow>
            <TextField
              inputMode="numeric"
              value={startTime}
              onChange={(val) => setStartTime(val)}
              placeholder="00:00"
              accessibilityLabel="Start time"
              icon="clock"
            />
          </InlineStack>

          <Icon type="arrow-right" />

          <InlineStack grow>
            <TextField
              inputMode="numeric"
              value={endTime}
              onChange={(val) => setEndTime(val)}
              placeholder="23:59"
              accessibilityLabel="End time"
              icon="clock"
            />
          </InlineStack>
          <Box inlineSize="28px" />
        </InlineStack>
      )}
    </BlockStack>
  );
}
