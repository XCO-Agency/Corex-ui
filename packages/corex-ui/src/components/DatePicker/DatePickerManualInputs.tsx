import { useState, useEffect } from "react";
import type { CSSProperties, ChangeEvent, KeyboardEvent } from "react";
import { formatDateDisplay, parseISODate, toISODateString } from "./datePickerUtils";
import { Button } from "../Button";
import { InlineStack } from "../InlineStack";
import { Icon } from "../Icon";

export type DatePickerManualInputsPropsType = {
  startDate: string;
  endDate: string;
  onChangeRange: (range: { start: string; end: string }) => void;
  className?: string;
};

export function DatePickerManualInputs({
  startDate,
  endDate,
  onChangeRange,
  className = "",
}: DatePickerManualInputsPropsType) {
  const [startText, setStartText] = useState(formatDateDisplay(startDate));
  const [endText, setEndText] = useState(formatDateDisplay(endDate));

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
      const s = toISODateString(dStart);
      const e = toISODateString(dEnd);
      if (s <= e) {
        onChangeRange({ start: s, end: e });
      } else {
        onChangeRange({ start: e, end: s });
      }
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

  return (
    <InlineStack alignItems="center" gap="small" padding="small">
      {/* Start Date Input */}
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
        onFocus={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 0 2px var(--p-color-border-focus, #005bd3)";
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      />

      {/* Arrow separator */}
      <Icon type="arrow-right" />

      {/* End Date Input */}
      <input
        type="text"
        value={endText}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEndText(e.target.value)}
        onBlur={tryParseAndCommit}
        onKeyDown={handleKeyDown}
        placeholder="End date"
        aria-label="End date"
        style={inputStyle}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 0 2px var(--p-color-border-focus, #005bd3)";
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      />

      {/* Clock icon */}
      <Button aria-label="Time" icon="clock" />
    </InlineStack>
  );
}
