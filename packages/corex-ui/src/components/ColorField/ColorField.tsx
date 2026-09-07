import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ColorFieldPropsType } from "./ColorField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const SColorField = createWebComponent<HTMLElement, FieldEvents>("s-color-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/** Controlled-form-input pattern for color field wrapping `s-color-field`. */
export const ColorField = forwardRef<HTMLElement, ColorFieldPropsType>(
  function ColorField(
    {
      label,
      value,
      defaultValue,
      alpha,
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
      <SColorField
        ref={ref}
        id={id}
        label={label}
        value={value ?? ""}
        defaultValue={defaultValue}
        alpha={alpha}
        details={details ?? helpText}
        required={requiredIndicator}
        onInput={handleInput}
        onBlur={onBlur}
        onFocus={onFocus}
        {...rest}
      >
        {slots}
      </SColorField>
    );
  },
);
