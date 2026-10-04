import { forwardRef } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { DatePickerVisibleMonthsType, DateRangeType } from "./DatePicker.types";

export const SDatePicker = createWebComponent<
  HTMLElement,
  {
    onInput: "input";
    onChange: "change";
    onViewChange: "viewchange";
  }
>("s-date-picker", {
  events: {
    onInput: "input",
    onChange: "change",
    onViewChange: "viewchange",
  },
  domProps: ["value", "view", "visibleMonths"],
});

export type DatePickerCalendarPropsType = {
  startDate?: string;
  endDate?: string;
  onSelectDate?: (dateStr: string) => void;
  viewDate?: string;
  /** Earliest selectable date (inclusive), as an ISO date string. */
  minDate?: string;
  /** Latest selectable date (inclusive), as an ISO date string. */
  maxDate?: string;
  type?: "single" | "multiple" | "range";
  visibleMonths?: DatePickerVisibleMonthsType;
  name?: string;
  value?: string;
  view?: string;
  defaultView?: string;
  defaultValue?: string;
  allow?: string;
  disallow?: string;
  allowDays?: string;
  disallowDays?: string;
  onChange?: (value: string | DateRangeType) => void;
  onChangeRange?: (range: DateRangeType) => void;
  onViewChange?: (view: string) => void;
  onInput?: (event: Event) => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
};

export const DatePickerCalendar: ForwardRefExoticComponent<
  DatePickerCalendarPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, DatePickerCalendarPropsType>(function DatePickerCalendar(
  {
    startDate,
    endDate,
    onSelectDate,
    viewDate,
    minDate,
    maxDate,
    type = "range",
    visibleMonths = "2",
    name,
    value: explicitValue,
    view: explicitView,
    defaultView,
    defaultValue,
    allow: explicitAllow,
    disallow,
    allowDays,
    disallowDays,
    onChange,
    onChangeRange,
    onViewChange,
    onInput,
    className,
    style,
    id,
    ...rest
  },
  ref,
) {
  // Compute value from explicitValue or startDate/endDate
  let computedValue = explicitValue;
  if (computedValue === undefined) {
    if (type === "single") {
      computedValue = startDate || "";
    } else {
      if (startDate && endDate) {
        computedValue = `${startDate}--${endDate}`;
      } else if (startDate) {
        computedValue = `${startDate}--`;
      } else {
        computedValue = "";
      }
    }
  }

  // Compute view from explicitView or viewDate or startDate
  let computedView = explicitView;
  if (!computedView) {
    if (viewDate) {
      computedView = viewDate.includes("-") ? viewDate.slice(0, 7) : viewDate;
    } else if (startDate) {
      computedView = startDate.includes("-") ? startDate.slice(0, 7) : startDate;
    }
  }

  // Compute allow from explicitAllow or minDate / maxDate
  let computedAllow = explicitAllow;
  if (!computedAllow && (minDate || maxDate)) {
    computedAllow = `${minDate || ""}--${maxDate || ""}`;
  }

  const handleInput = (event: Event) => {
    onInput?.(event);
    const target = event.currentTarget as (EventTarget & { value?: string }) | null;
    const val = target?.value || "";

    if (val.includes("--")) {
      const [start = "", end = ""] = val.split("--");
      if (end) {
        onSelectDate?.(end);
        onChangeRange?.({ start, end });
      } else if (start) {
        onSelectDate?.(start);
        onChangeRange?.({ start, end: "" });
      }
    } else if (val) {
      onSelectDate?.(val);
      onChangeRange?.({ start: val, end: val });
    }
  };

  const handleChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { value?: string }) | null;
    const val = target?.value || "";

    if (val.includes("--")) {
      const [start = "", end = ""] = val.split("--");
      if (start && end) {
        onChangeRange?.({ start, end });
        onChange?.({ start, end });
      }
    } else if (val) {
      onChangeRange?.({ start: val, end: val });
      onChange?.(val);
    }
  };

  const handleViewChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { view?: string }) | null;
    const v = target?.view || "";
    onViewChange?.(v);
  };

  return (
    <SDatePicker
      ref={ref}
      id={id}
      type={type}
      name={name}
      visibleMonths={String(visibleMonths) as any}
      view={computedView}
      defaultView={defaultView}
      value={computedValue}
      defaultValue={defaultValue}
      allow={computedAllow}
      disallow={disallow}
      allowDays={allowDays}
      disallowDays={disallowDays}
      onInput={handleInput}

      onChange={handleChange}
      onViewChange={handleViewChange}
      className={className}
      style={style}
      {...rest}
    />
  );
});
