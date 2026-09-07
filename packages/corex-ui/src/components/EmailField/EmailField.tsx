import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { EmailFieldPropsType } from "./EmailField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const SEmailField = createWebComponent<HTMLElement, FieldEvents>("s-email-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/** Controlled-form-input pattern for email field wrapping `s-email-field`. */
export const EmailField = forwardRef<HTMLElement, EmailFieldPropsType>(
  function EmailField(
    {
      label,
      value,
      defaultValue,
      minLength,
      maxLength,
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
      <SEmailField
        ref={ref}
        id={id}
        label={label}
        value={value ?? ""}
        defaultValue={defaultValue}
        minlength={minLength}
        maxlength={maxLength}
        details={details ?? helpText}
        required={requiredIndicator}
        onInput={handleInput}
        onBlur={onBlur}
        onFocus={onFocus}
        {...rest}
      >
        {slots}
      </SEmailField>
    );
  },
);
