import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { DateFieldPropsType } from "./DateField.types";

const SDateField = createWebComponent<HTMLElement, { onInput: "input" }>("s-date-field", {
  events: { onInput: "input" },
  domProps: ["value"],
});

/** Controlled-form-input pattern, identical shape to `TextField`. */
export const DateField = forwardRef<HTMLElement, DateFieldPropsType>(function DateField(
  { value, onChange, helpText, details, id, ...rest },
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
      details={details ?? helpText}
      onInput={handleInput}
      {...rest}
    />
  );
});
