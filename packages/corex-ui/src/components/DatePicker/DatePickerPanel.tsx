import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import type {
  DatePresetItemType,
  DatePickerPropsType,
  DateRangeType,
} from "./DatePicker.types";
import { DatePickerPresets } from "./DatePickerPresets";
import { DatePickerManualInputs } from "./DatePickerManualInputs";
import { DatePickerCalendar } from "./DatePickerCalendar";
import { normalizeDateRange } from "./datePickerUtils";
import { Button } from "../Button";
import { Divider } from "../Divider";
import { InlineStack } from "../InlineStack";
import { BlockStack } from "../BlockStack";

export type DatePickerPanelPropsType = Pick<
  DatePickerPropsType,
  "selected" | "defaultValue" | "presets" | "onApply" | "onCancel"
> & {
  onChangeRange?: (range: DateRangeType) => void;
  id: string;
  inline?: boolean;
};

export function DatePickerPanel({
  selected,
  defaultValue,
  id,
  inline,
  presets = true,
  onApply,
  onCancel,
  onChangeRange,
}: DatePickerPanelPropsType) {
  // Normalize initial range from selected / defaultValue prop
  const getInitialRange = (): DateRangeType => {
    return normalizeDateRange(selected ?? defaultValue);
  };

  const [currentRange, setCurrentRange] = useState<DateRangeType>(getInitialRange);
  const [viewDate, setViewDate] = useState<string>(() => getInitialRange().start);
  const [activePresetId, setActivePresetId] = useState<string>("custom");

  useEffect(() => {
    const range = normalizeDateRange(selected ?? defaultValue);
    setCurrentRange(range);
    setViewDate(range.start);
  }, [selected, defaultValue]);

  // Sync / reset to default or selected date whenever the popover opens
  useEffect(() => {
    if (inline || !id) return;
    const popoverEl = document.getElementById(id);
    if (!popoverEl) return;

    const handleToggle = (e: Event) => {
      const toggleEvent = e as any;
      const isOpen =
        toggleEvent.newState === "open" ||
        popoverEl.matches?.(":popover-open") ||
        popoverEl.hasAttribute("open");

      if (isOpen) {
        const range = getInitialRange();
        setCurrentRange(range);
        setViewDate(range.start);
      }
    };

    popoverEl.addEventListener("toggle", handleToggle);
    popoverEl.addEventListener("beforetoggle", handleToggle);

    return () => {
      popoverEl.removeEventListener("toggle", handleToggle);
      popoverEl.removeEventListener("beforetoggle", handleToggle);
    };
  }, [id, inline, selected, defaultValue]);

  // Requirement 1: presets can be shown on left when available, otherwise hide
  const hasPresets = Boolean(presets);

  const handleSelectPreset = (preset: DatePresetItemType) => {
    setActivePresetId(preset.id);

    if (preset.range) {
      const range = typeof preset.range === "function" ? preset.range() : preset.range;
      setCurrentRange(range);
      if (range.start) {
        setViewDate(range.start);
      }
      onChangeRange?.(range);
    }
  };

  const handleDateClick = (clickedDate: string) => {
    // If range is already complete or no start, set new start date
    if (
      !currentRange.start ||
      (currentRange.start && currentRange.end && currentRange.start !== currentRange.end)
    ) {
      const newRange = { start: clickedDate, end: "" };
      setCurrentRange(newRange);
      setActivePresetId("custom");
    } else if (currentRange.start && !currentRange.end) {
      // Complete the range
      if (clickedDate >= currentRange.start) {
        const newRange = { start: currentRange.start, end: clickedDate };
        setCurrentRange(newRange);
        setActivePresetId("custom");
        onChangeRange?.(newRange);
      } else {
        const newRange = { start: clickedDate, end: currentRange.start };
        setCurrentRange(newRange);
        setActivePresetId("custom");
        onChangeRange?.(newRange);
      }
    } else if (currentRange.start === currentRange.end) {
      if (clickedDate >= currentRange.start) {
        const newRange = { start: currentRange.start, end: clickedDate };
        setCurrentRange(newRange);
        setActivePresetId("custom");
        onChangeRange?.(newRange);
      } else {
        const newRange = { start: clickedDate, end: currentRange.start };
        setCurrentRange(newRange);
        setActivePresetId("custom");
        onChangeRange?.(newRange);
      }
    }
  };

  const handleManualRangeChange = (newRange: DateRangeType) => {
    setCurrentRange(newRange);
    if (newRange.start) {
      setViewDate(newRange.start);
    }
    setActivePresetId("custom");
    onChangeRange?.(newRange);
  };

  const handleApply = () => {
    const finalRange: DateRangeType = {
      start: currentRange.start,
      end: currentRange.end || currentRange.start,
    };
    onApply?.(finalRange);
    onChangeRange?.(finalRange);
  };

  return (
    <InlineStack>
      {/* Left Presets Sidebar */}
      {hasPresets && (
        <>
          <DatePickerPresets
            presets={presets}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
          />
          <Divider direction="block" />
        </>
      )}

      {/* Right Content */}
      <BlockStack minInlineSize="480px">
        {/* Top Manual Inputs */}
        <DatePickerManualInputs
          startDate={currentRange.start}
          endDate={currentRange.end || currentRange.start}
          onChangeRange={handleManualRangeChange}
        />

        <Divider />

        {/* Dual Month Calendar */}
        <DatePickerCalendar
          startDate={currentRange.start}
          endDate={currentRange.end || currentRange.start}
          viewDate={viewDate}
          onSelectDate={handleDateClick}
        />

        {!inline && (
          <>
            <Divider />

            {/* Bottom Actions */}
            <InlineStack justifyContent="end" padding="small-100" gap="small">
              <Button onClick={onCancel} commandFor={id} command="--hide">
                Cancel
              </Button>

              <Button
                variant="primary"
                commandFor={id}
                command="--hide"
                onClick={handleApply}
                disabled={
                  typeof currentRange === "string"
                    ? !currentRange
                    : !currentRange?.start || !currentRange?.end
                }
              >
                Apply
              </Button>
            </InlineStack>
          </>
        )}
      </BlockStack>
    </InlineStack>
  );
}
