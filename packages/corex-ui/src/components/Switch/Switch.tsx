import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { SwitchPropsType } from "./Switch.types";

const SSwitch = createWebComponent<HTMLElement, { onChange: "change" }>("s-switch", {
  events: { onChange: "change" },
  domProps: ["checked"],
});

/**
 * Switch component wrapping Polaris `<s-switch>`.
 * Controlled toggle switch pattern: `checked` is kept in sync as a live DOM property.
 */
export const Switch = forwardRef<HTMLElement, SwitchPropsType>(function Switch(
  { label, checked, onChange, details, id, ...rest },
  ref,
) {
  const handleChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { checked?: boolean }) | null;
    onChange?.(Boolean(target?.checked), id ?? "");
  };

  return (
    <SSwitch
      ref={ref}
      id={id}
      label={label}
      checked={checked}
      details={details}
      accessibilityLabel={rest.accessibilityLabel ?? "Swicher"}
      onChange={handleChange}
      {...rest}
    />
  );
});
