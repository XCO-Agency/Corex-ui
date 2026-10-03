import { useState, useEffect } from "react";
import type {
  DatePresetItemType,
  DatePickerPropsType,
  DateRangeType,
} from "./DatePicker.types";
import { DatePickerPresets } from "./DatePickerPresets";
import { DatePickerManualInputs } from "./DatePickerManualInputs";
import { DatePickerCalendar } from "./DatePickerCalendar";
import { normalizeDateRange, toISODateString } from "./datePickerUtils";
import { Button } from "../Button";
import { Divider } from "../Divider";
import { InlineStack } from "../InlineStack";
import { BlockStack } from "../BlockStack";

export type DatePickerPanelPropsType = Pick<
  DatePickerPropsType,
  | "selected"
  | "defaultValue"
  | "presets"
  | "onApply"
  | "onCancel"
  | "minDate"
  | "maxDate"
  | "type"
  | "name"
  | "visibleMonths"
  | "view"
  | "defaultView"
  | "allow"
  | "disallow"
  | "allowDays"
  | "disallowDays"
  | "onViewChange"
  | "onInput"
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
  minDate,
  maxDate,
  onApply,
  onCancel,
  onChangeRange,
  type = "range",
  name,
  visibleMonths = "2",
  view,
  defaultView,
  allow,
  disallow,
  allowDays,
  disallowDays,
  onViewChange,
  onInput,
}: DatePickerPanelPropsType) {
  // Requirement: future dates are disabled by default (maxDate defaults to today).
  const effectiveMaxDate = maxDate ?? toISODateString(new Date());
  // Normalize initial range from selected / defaultValue prop
  const getInitialRange = (): DateRangeType => {
    return normalizeDateRange(selected ?? defaultValue);
  };

  const [currentRange, setCurrentRange] = useState<DateRangeType>(getInitialRange);
  const [viewDate, setViewDate] = useState<string>(
    () => view ?? defaultView ?? getInitialRange().start,
  );
  const [activePresetId, setActivePresetId] = useState<string>("custom");

  useEffect(() => {
    const range = normalizeDateRange(selected ?? defaultValue);
    setCurrentRange(range);
    if (!view) {
      setViewDate(range.start);
    }
  }, [selected, defaultValue, view]);

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



  const handleCalendarRangeChange = (newRange: DateRangeType) => {
    setCurrentRange(newRange);
    setActivePresetId("custom");
    if (newRange.start) {
      setViewDate(newRange.start);
    }
    if (newRange.start && newRange.end) {
      onChangeRange?.(newRange);
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
    // Only surface a presetId when a preset (not a manual/custom selection) is active,
    // so consumers can persist the semantic preset id instead of the resolved range.
    if (activePresetId && activePresetId !== "custom") {
      onApply?.(finalRange, { presetId: activePresetId });
    } else {
      onApply?.(finalRange);
    }
    onChangeRange?.(finalRange);
  };

  return (
    <InlineStack wrap={false}>
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
      <BlockStack maxInlineSize="520px">
        {/* Top Manual Inputs */}
        <DatePickerManualInputs
          startDate={currentRange.start}
          endDate={currentRange.end}
          onChangeRange={handleManualRangeChange}
          minDate={minDate}
          maxDate={effectiveMaxDate}
        />

        <Divider />

        {/* Dual Month Calendar */}
        <DatePickerCalendar
          startDate={currentRange.start}
          endDate={currentRange.end}
          viewDate={viewDate}
          onChangeRange={handleCalendarRangeChange}
          onViewChange={(v) => {
            setViewDate(v);
            onViewChange?.(v);
          }}
          onInput={onInput}
          minDate={minDate}
          maxDate={effectiveMaxDate}
          type={type}
          name={name}
          visibleMonths={visibleMonths}
          defaultView={defaultView}
          allow={allow}
          disallow={disallow}
          allowDays={allowDays}
          disallowDays={disallowDays}
        />

        {!inline && (
          <>
            <Divider />

            {/* Bottom Actions */}
            <InlineStack justifyContent="end" padding="small-100" gap="small-200">
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
