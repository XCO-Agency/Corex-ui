import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { NumberFieldPropsType } from "./NumberField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const SNumberField = createWebComponent<HTMLElement, FieldEvents>("s-number-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/** Controlled-form-input pattern for number field wrapping `s-number-field`. */
export const NumberField = forwardRef<HTMLElement, NumberFieldPropsType>(
  function NumberField({ onChange, helpText, details, id, ...rest }, ref) {
    const handleInput = (event: Event) => {
      const target = event.currentTarget as (EventTarget & { value?: string }) | null;
      onChange?.(target?.value ?? "", id ?? "");
    };

    return (
      <SNumberField
        ref={ref}
        id={id}
        details={details ?? helpText}
        onInput={handleInput}
        {...rest}
      />
    );
  },
);
