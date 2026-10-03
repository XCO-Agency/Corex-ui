import { forwardRef, useId } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Popover } from "../Popover";
import type { DatePickerPropsType, DateRangeType } from "./DatePicker.types";
import { DatePickerPanel } from "./DatePickerPanel";
import { SDatePicker } from "./DatePickerCalendar";
import { formatRangeDisplay, normalizeDateRange } from "./datePickerUtils";
import { Button } from "../Button";

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
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const popoverId = id ?? `date-picker-popover-${generatedId.replace(/:/g, "")}`;

  // Normalize selected / default value / value into range
  const currentRange: DateRangeType = normalizeDateRange(
    selected ?? defaultValue ?? value,
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
      />
    );
  }

  return (
    <Popover id={popoverId}>
      {effectiveTrigger}
      <Popover.Content ref={ref} maxBlockSize="none" {...rest}>
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
        />
      </Popover.Content>
    </Popover>
  );
});
