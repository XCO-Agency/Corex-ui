import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { DatePickerProps } from "./DatePicker.types";

const SDatePicker = createWebComponent<HTMLElement, { onChange: "change" }>("s-date-picker", {
  events: { onChange: "change" },
  domProps: ["selected"],
});

/**
 * Controlled-form-input pattern over `s-date-picker`. Only single-date
 * selection is supported in this release — legacy `DatePicker`'s range mode
 * (`allowRange`, `{start, end}` selection) isn't implemented yet; see
 * `docs/component-coverage.md`.
 */
export const DatePicker = forwardRef<HTMLElement, DatePickerProps>(function DatePicker(
  { selected, onChange, ...rest },
  ref,
) {
  const handleChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { selected?: string }) | null;
    onChange?.(target?.selected ?? "");
  };

  return <SDatePicker ref={ref} selected={selected} onChange={handleChange} {...rest} />;
});
