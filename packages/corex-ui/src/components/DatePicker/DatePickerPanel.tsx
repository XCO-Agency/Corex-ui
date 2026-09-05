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
import { toISODateString } from "./datePickerUtils";
import { Button } from "../Button";
import { Divider } from "../Divider";
import { InlineStack } from "../InlineStack";
import { BlockStack } from "../BlockStack";

export type DatePickerPanelPropsType = Pick<
  DatePickerPropsType,
  "selected" | "presets" | "onApply" | "onCancel"
> & {
  onChangeRange?: (range: DateRangeType) => void;
  id: string;
};

export function DatePickerPanel({
  selected,
  id,
  presets = true,
  onApply,
  onCancel,
  onChangeRange,
}: DatePickerPanelPropsType) {
  // Normalize initial range from selected prop
  const getInitialRange = (): DateRangeType => {
    if (!selected) {
      const today = toISODateString(new Date());
      return { start: today, end: today };
    }
    if (typeof selected === "string") {
      return { start: selected, end: selected };
    }
    return selected;
  };

  const [currentRange, setCurrentRange] = useState<DateRangeType>(getInitialRange);
  const [activePresetId, setActivePresetId] = useState<string>("custom");

  useEffect(() => {
    if (selected) {
      if (typeof selected === "string") {
        setCurrentRange({ start: selected, end: selected });
      } else {
        setCurrentRange(selected);
      }
    }
  }, [selected]);

  // Requirement 1: presets can be shown on left when available, otherwise hide
  const hasPresets = Boolean(presets);

  const handleSelectPreset = (preset: DatePresetItemType) => {
    setActivePresetId(preset.id);

    if (preset.range) {
      const range = typeof preset.range === "function" ? preset.range() : preset.range;
      setCurrentRange(range);
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
          onSelectDate={handleDateClick}
        />

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
      </BlockStack>
    </InlineStack>
  );
}
