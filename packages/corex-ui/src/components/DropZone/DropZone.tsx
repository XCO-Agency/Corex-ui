import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { DropZonePropsType } from "./DropZone.types";

type DropZoneEvents = {
  onChange: "change";
  onInput: "input";
  onDropRejected: "droprejected";
  onBlur: "blur";
  onFocus: "focus";
};

const dropZoneEvents: DropZoneEvents = {
  onChange: "change",
  onInput: "input",
  onDropRejected: "droprejected",
  onBlur: "blur",
  onFocus: "focus",
};

const SDropZone = createWebComponent<HTMLElement, DropZoneEvents>("s-drop-zone", {
  events: dropZoneEvents,
  domProps: ["value"],
});

/** Form control component for drag-and-drop or browsing file uploads wrapping `s-drop-zone`. */
export const DropZone = forwardRef<HTMLElement, DropZonePropsType>(function DropZone(
  {
    label,
    accept,
    multiple,
    allowMultiple,
    accessibilityLabel,
    labelAccessibilityVisibility,
    disabled,
    error,
    helpText,
    details,
    requiredIndicator,
    required,
    id,
    name,
    value,
    files,
    onChange,
    onDrop,
    onInput,
    onDropRejected,
    onBlur,
    onFocus,
    children,
    ...rest
  },
  ref,
) {
  const isMultiple = multiple ?? allowMultiple;
  const isRequired = required ?? requiredIndicator;

  // `s-drop-zone` reports through `change` with a DOM event, where the files sit on
  // the element the way a native file input reports them. v12 handed them straight
  // to the caller, so both shapes are supported.
  const handleChange = (event: Event) => {
    onChange?.(event);
    if (!onDrop) return;

    const target = event.target as HTMLInputElement | null;
    onDrop(Array.from(target?.files ?? []));
  };

  return (
    <SDropZone
      ref={ref}
      id={id}
      name={name}
      label={label}
      accept={accept}
      multiple={isMultiple}
      accessibility-label={accessibilityLabel}
      label-accessibility-visibility={labelAccessibilityVisibility}
      disabled={disabled}
      error={error}
      details={details ?? helpText}
      required={isRequired}
      value={value}
      onChange={onChange || onDrop ? handleChange : undefined}
      onInput={onInput}
      onDropRejected={onDropRejected}
      onBlur={onBlur}
      onFocus={onFocus}
      {...rest}
    >
      {children}
    </SDropZone>
  );
});
