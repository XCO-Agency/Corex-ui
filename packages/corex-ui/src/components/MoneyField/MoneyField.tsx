import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { MoneyFieldPropsType } from "./MoneyField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const SMoneyField = createWebComponent<HTMLElement, FieldEvents>("s-money-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/**
 * Controlled-form-input pattern for money field wrapping `s-money-field`.
 *
 * Legacy `onChange` fires on every keystroke, which is the element's `input`,
 * not its `change` - the same reasoning TextField, EmailField and UrlField
 * already carry. This was the one field still bound to `change`, so a
 * controlled money input did not update as it was typed into.
 */
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
        onInput={handleInput}
        {...rest}
      />
    );
  },
);
