import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { PasswordFieldPropsType } from "./PasswordField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const SPasswordField = createWebComponent<HTMLElement, FieldEvents>("s-password-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/** Controlled-form-input pattern for password field wrapping `s-password-field`. */
export const PasswordField = forwardRef<HTMLElement, PasswordFieldPropsType>(function PasswordField(
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
    <SPasswordField
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
    </SPasswordField>
  );
});
