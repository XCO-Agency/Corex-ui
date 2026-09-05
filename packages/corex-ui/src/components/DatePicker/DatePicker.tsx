import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { DatePickerPropsType } from "./DatePicker.types";

const SDatePicker = createWebComponent<HTMLElement, { onChange: "change" }>(
  "s-date-picker",
  {
    events: { onChange: "change" },
    domProps: ["selected"],
  },
);

/**
 * Controlled-form-input pattern over `s-date-picker`. Only single-date
 * selection is supported in this release.
 */
export const DatePicker = forwardRef<HTMLElement, DatePickerPropsType>(function DatePicker(
  { selected, onChange, ...rest },
  ref,
) {
  const handleChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { selected?: string }) | null;
    onChange?.(target?.selected ?? "");
  };

  return <SDatePicker ref={ref} selected={selected} onChange={handleChange} {...rest} />;
});
