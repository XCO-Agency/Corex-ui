import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { MoneyFieldPropsType } from "./MoneyField.types";

type FieldEvents = { onChange: "change"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onChange: "change", onBlur: "blur", onFocus: "focus" };

const SMoneyField = createWebComponent<HTMLElement, FieldEvents>("s-money-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/** Controlled-form-input pattern for money field wrapping `s-money-field`. */
export const MoneyField = forwardRef<HTMLElement, MoneyFieldPropsType>(
  function MoneyField({ onChange, helpText, details, ...rest }, ref) {
    const handleInput = (event: Event) => {
      const target = event.currentTarget as (EventTarget & { value?: string }) | null;
      onChange?.(target?.value ?? "", rest.id ?? "");
    };

    return (
      <SMoneyField
        ref={ref}
        details={details ?? helpText}
        onChange={handleInput}
        {...rest}
      />
    );
  },
);
