import { forwardRef, useRef, type CSSProperties } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { useIsomorphicLayoutEffect } from "../../core/useIsomorphicLayoutEffect";
import { Icon } from "../Icon";
import { DROP_ZONE_CSS, DROP_ZONE_STYLE_ID } from "./DropZone.css";
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

function ensureDropZoneStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  if (!doc) return;
  const existing = doc.getElementById(DROP_ZONE_STYLE_ID);
  if (existing) {
    if (existing.textContent !== DROP_ZONE_CSS) {
      existing.textContent = DROP_ZONE_CSS;
    }
    return;
  }
  const style = doc.createElement("style");
  style.id = DROP_ZONE_STYLE_ID;
  style.textContent = DROP_ZONE_CSS;
  doc.head.appendChild(style);
}

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
    size = "base",
    inlineSize = "5rem",
    icon = "upload",
    onChange,
    onDrop,
    onInput,
    onDropRejected,
    onBlur,
    onFocus,
    children,
    className,
    ...rest
  },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isMultiple = multiple ?? allowMultiple;
  const isRequired = required ?? requiredIndicator;
  const isSmall = size === "small";
  const resolvedLabelVisibility =
    labelAccessibilityVisibility ?? (isSmall ? "exclusive" : undefined);
  const isFill = isSmall && inlineSize === "fill";

  useIsomorphicLayoutEffect(() => {
    if (!isSmall) return;
    ensureDropZoneStyles(wrapperRef.current);
  }, [isSmall]);

  // `s-drop-zone` reports through `change` with a DOM event, where the files sit on
  // the element the way a native file input reports them. v12 handed them straight
  // to the caller, so both shapes are supported.
  const handleChange = (event: Event) => {
    onChange?.(event);
    if (!onDrop) return;

    const target = event.target as HTMLInputElement | null;
    onDrop(Array.from(target?.files ?? []));
  };

  const resolvedChildren =
    children ??
    (isSmall ? (
      <span data-slot="drop-zone-content">
        <Icon type={icon} />
      </span>
    ) : undefined);

  const dropZone = (
    <SDropZone
      ref={ref}
      id={id}
      name={name}
      label={label}
      accept={accept}
      multiple={isMultiple}
      accessibility-label={accessibilityLabel}
      label-accessibility-visibility={resolvedLabelVisibility}
      disabled={disabled}
      error={error}
      details={details ?? helpText}
      required={isRequired}
      value={value}
      className={isSmall ? undefined : className}
      onChange={onChange || onDrop ? handleChange : undefined}
      onInput={onInput}
      onDropRejected={onDropRejected}
      onBlur={onBlur}
      onFocus={onFocus}
      {...rest}
    >
      {resolvedChildren}
    </SDropZone>
  );

  if (!isSmall) {
    return dropZone;
  }

  const wrapperStyle: CSSProperties | undefined = isFill
    ? undefined
    : ({
        ["--cx-drop-zone-inline-size" as string]: inlineSize,
      } as CSSProperties);

  return (
    <div
      ref={wrapperRef}
      data-slot="drop-zone"
      data-size="small"
      data-inline-size={isFill ? "fill" : undefined}
      className={className}
      style={wrapperStyle}
    >
      {dropZone}
    </div>
  );
});
