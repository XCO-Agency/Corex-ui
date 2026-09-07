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
export const MoneyField = forwardRef<HTMLElement, MoneyFieldPropsType>(function MoneyField(
  {
    label,
    value,
    defaultValue,
    currencyCode,
    min,
    max,
    step,
    onChange,
    onBlur,
    onFocus,
    helpText,
    details,
    prefix,
    suffix,
    requiredIndicator,
    id,
    ...rest
  },
  ref,
) {
  const handleInput = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { value?: string }) | null;
    onChange?.(target?.value ?? "", id ?? "");
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
      id={id}
      label={label}
      value={value ?? ""}
      defaultValue={defaultValue}
      currency-code={currencyCode}
      min={min}
      max={max}
      step={step}
      details={details ?? helpText}
      required={requiredIndicator}
      onInput={handleInput}
      onBlur={onBlur}
      onFocus={onFocus}
      {...rest}
    >
      {slots}
    </SMoneyField>
  );
});
