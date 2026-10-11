import { forwardRef, useId } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Popover } from "../Popover";
import type { DatePickerPropsType, DateRangeType } from "./DatePicker.types";
import { DatePickerPanel } from "./DatePickerPanel";
import { SDatePicker } from "./DatePickerCalendar";
import { formatRangeDisplay, normalizeDateRange } from "./datePickerUtils";
import { Button } from "../Button";
import { useDatePickerToday } from "./useDatePickerToday";
import { useHydrated } from "../../core/useHydrated";

export const DatePicker: ForwardRefExoticComponent<
  DatePickerPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, DatePickerPropsType>(function DatePicker(
  {
    selected,
    defaultValue,
    onChange,
    onApply,
    onCancel,
    presets = true,
    inline = false,
    children,
    activator,
    minDate,
    maxDate,
    disabled = false,
    id,
    className,
    style,
    type,
    name,
    visibleMonths,
    view,
    defaultView,
    value,
    allow,
    disallow,
    allowDays,
    disallowDays,
    onViewChange,
    onInput,
    referenceDate,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const popoverId = id ?? `date-picker-popover-${generatedId.replace(/:/g, "")}`;
  const today = useDatePickerToday(referenceDate);
  // The panel (calendar, manual inputs, presets) sits in a closed popover, so
  // nothing is lost by leaving it out of the server HTML — and it is full of
  // date-dependent markup the hydrating render couldn't reproduce.
  const hydrated = useHydrated();

  // Normalize selected / default value / value into range
  const currentRange: DateRangeType = normalizeDateRange(
    selected ?? defaultValue ?? value,
    today,
  );

  const handleRangeChange = (range: DateRangeType) => {
    if (typeof selected === "string") {
      onChange?.(range.start);
    } else {
      onChange?.(range);
    }
  };

  const handleApply = (range: DateRangeType, meta?: { presetId?: string }) => {
    if (meta) {
      onApply?.(range, meta);
    } else {
      onApply?.(range);
    }
    handleRangeChange(range);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  // Default trigger button with commandFor matching the Popover id
  const defaultTrigger = (
    <Button disabled={disabled} icon="calendar" commandFor={popoverId}>
      {formatRangeDisplay(currentRange)}
    </Button>
  );

  const effectiveTrigger = children
    ? children(formatRangeDisplay(currentRange), popoverId)
    : (activator ?? defaultTrigger);

  if (inline) {
    return (
      <DatePickerPanel
        id={popoverId}
        selected={selected ?? value}
        defaultValue={defaultValue}
        presets={presets}
        minDate={minDate}
        maxDate={maxDate}
        inline
        type={type}
        name={name}
        visibleMonths={visibleMonths}
        view={view}
        defaultView={defaultView}
        allow={allow}
        disallow={disallow}
        allowDays={allowDays}
        disallowDays={disallowDays}
        onViewChange={onViewChange}
        onInput={onInput}
        onApply={handleApply}
        onCancel={handleCancel}
        onChangeRange={handleRangeChange}
        referenceDate={referenceDate}
      />
    );
  }

  return (
    <Popover id={popoverId}>
      {effectiveTrigger}
      <Popover.Content ref={ref} maxBlockSize="none" {...rest}>
        {hydrated && (
          <DatePickerPanel
            id={popoverId}
            selected={selected ?? value}
            defaultValue={defaultValue}
            presets={presets}
            minDate={minDate}
            maxDate={maxDate}
            type={type}
            name={name}
            visibleMonths={visibleMonths}
            view={view}
            defaultView={defaultView}
            allow={allow}
            disallow={disallow}
            allowDays={allowDays}
            disallowDays={disallowDays}
            onViewChange={onViewChange}
            onInput={onInput}
            onApply={handleApply}
            onCancel={handleCancel}
            onChangeRange={handleRangeChange}
            referenceDate={referenceDate}
          />
        )}
      </Popover.Content>
    </Popover>
  );
});
