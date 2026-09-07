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
export const NumberField = forwardRef<HTMLElement, NumberFieldPropsType>(function NumberField(
  {
    label,
    value,
    defaultValue,
    min,
    max,
    step,
    inputMode,
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
    <SNumberField
      ref={ref}
      id={id}
      label={label}
      value={value ?? ""}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      inputmode={inputMode}
      details={details ?? helpText}
      required={requiredIndicator}
      onInput={handleInput}
      onBlur={onBlur}
      onFocus={onFocus}
      {...rest}
    >
      {slots}
    </SNumberField>
  );
});
