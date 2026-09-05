import { forwardRef, useId } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { Popover } from "../Popover";
import type { DatePickerPropsType, DateRangeType } from "./DatePicker.types";
import { DatePickerPanel } from "./DatePickerPanel";
import { formatRangeDisplay, toISODateString } from "./datePickerUtils";
import { Button } from "../Button";

const SDatePicker = createWebComponent<HTMLElement, { onChange: "change" }>(
  "s-date-picker",
  {
    events: { onChange: "change" },
    domProps: ["selected"],
  },
);

export const DatePicker: ForwardRefExoticComponent<
  DatePickerPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, DatePickerPropsType>(function DatePicker(
  {
    selected,
    onChange,
    onApply,
    onCancel,
    presets = false,
    inline = false,
    children,
    activator,
    disabled = false,
    id,
    className,
    style,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const popoverId = id ?? `date-picker-popover-${generatedId.replace(/:/g, "")}`;

  // Normalize selected value into range
  const currentRange: DateRangeType = (() => {
    if (!selected) {
      const today = toISODateString(new Date());
      return { start: today, end: today };
    }
    if (typeof selected === "string") {
      return { start: selected, end: selected };
    }
    return selected;
  })();

  const handleRangeChange = (range: DateRangeType) => {
    if (typeof selected === "string") {
      onChange?.(range.start);
    } else {
      onChange?.(range);
    }
  };

  const handleApply = (range: DateRangeType) => {
    onApply?.(range);
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
        selected={selected}
        presets={presets}
        onApply={handleApply}
        onCancel={handleCancel}
        onChangeRange={handleRangeChange}
      />
    );
  }
  return (
    <>
      {effectiveTrigger}
      <Popover id={popoverId} ref={ref} maxBlockSize="none" {...rest}>
        <DatePickerPanel
          id={popoverId}
          selected={selected}
          presets={presets}
          onApply={handleApply}
          onCancel={handleCancel}
          onChangeRange={handleRangeChange}
        />
      </Popover>
    </>
  );
});
