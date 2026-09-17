import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { MoneyFieldPropsType } from "./MoneyField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const SMoneyField = createWebComponent<HTMLElement, FieldEvents>("s-money-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/** Controlled-form-input pattern for money field wrapping `s-money-field`. */
export const MoneyField = forwardRef<HTMLElement, MoneyFieldPropsType>(
  function MoneyField({ onChange, helpText, details, prefix, suffix, ...rest }, ref) {
    const handleInput = (event: Event) => {
      const target = event.currentTarget as (EventTarget & { value?: string }) | null;
      onChange?.(target?.value ?? "", rest.id ?? "");
    };

    const slots = (
      <>
        {prefix ? <span slot="prefix">{prefix}</span> : null}
        {suffix ? <span slot="suffix">{suffix}</span> : null}
      </>
    );

    return (
      <SMoneyField
        ref={ref}
        details={details ?? helpText}
        onInput={handleInput}
        {...rest}
      >
        {slots}
      </SMoneyField>
    );
  },
);
