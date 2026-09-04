import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { DateFieldProps } from "./DateField.types";

const SDateField = createWebComponent<HTMLElement, { onInput: "input" }>("s-date-field", {
  events: { onInput: "input" },
  domProps: ["value"],
});

/** Controlled-form-input pattern, identical shape to `TextField`. */
export const DateField = forwardRef<HTMLElement, DateFieldProps>(function DateField(
  { value, onChange, helpText, id, ...rest },
  ref,
) {
  const handleInput = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { value?: string }) | null;
    onChange?.(target?.value ?? "", id ?? "");
  };

  return (
    <SDateField
      ref={ref}
      id={id}
      value={value ?? ""}
      details={helpText}
      onInput={handleInput}
      {...rest}
    />
  );
});
