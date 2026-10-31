import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mergeRefs } from "../../core/mergeRefs";
import { Box } from "../Box";
import { FlexPopover } from "../FlexPopover";
import { Text } from "../Text";
import { TextField } from "../TextField";
import type { ColorFieldPropsType } from "./ColorField.types";

type PickerEvents = { onInput: "input"; onChange: "change" };
const pickerEvents: PickerEvents = { onInput: "input", onChange: "change" };

const SColorPicker = createWebComponent<HTMLElement, PickerEvents>("s-color-picker", {
  events: pickerEvents,
  domProps: ["value"],
});

const SWATCH_SIZE = "1.25rem";

const swatchStyle = (backgroundColor: string): CSSProperties => ({
  backgroundColor,
  boxShadow: "inset 0 0 0 0.0625rem rgba(0, 0, 0, 0.08)",
  flexShrink: 0,
});

function resolveSwatchColor(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "#FFFFFF";
}

function readEventValue(event: Event): string {
  const target = event.currentTarget as (EventTarget & { value?: string }) | null;
  return target?.value ?? "";
}

/** Color text field with swatch prefix and a picker popover that opens on focus. */
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
      name,
      disabled,
      readOnly,
      error,
      placeholder,
      autoComplete,
      labelAccessibilityVisibility,
      className,
      ...rest
    },
    ref,
  ) {
    const fieldRef = useRef<HTMLElement>(null);
    const mergedRef = useMemo(() => mergeRefs(fieldRef, ref), [ref]);

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
    const [open, setOpen] = useState(false);

    const currentValue = isControlled ? (value ?? "") : uncontrolledValue;
    const swatchColor = resolveSwatchColor(currentValue);

    const commit = useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolledValue(next);
        onChange?.(next, id ?? "");
      },
      [id, isControlled, onChange],
    );

    const handleTextChange = useCallback(
      (next: string) => {
        commit(next);
      },
      [commit],
    );

    const handlePickerInput = useCallback(
      (event: Event) => {
        commit(readEventValue(event));
      },
      [commit],
    );

    const handleFocus = useCallback(
      (event: Event) => {
        if (!disabled && !readOnly) setOpen(true);
        onFocus?.(event);
      },
      [disabled, onFocus, readOnly],
    );

    const handleClose = useCallback(() => {
      setOpen(false);
    }, []);

    // Use a slotted host element (not `<Box style>`): Box wraps styled
    // content in a `<div>`, which would steal the `prefix` slot from the field.
    const swatch = (
      <span
        slot="prefix"
        style={{
          display: "block",
          inlineSize: SWATCH_SIZE,
          blockSize: SWATCH_SIZE,
          borderRadius: "9999px",
          ...swatchStyle(swatchColor),
        }}
      >
        <Text accessibilityVisibility="exclusive">
          Colour preview, click to open color picker
        </Text>
      </span>
    );

    return (
      <>
        <TextField
          ref={mergedRef}
          id={id}
          name={name}
          label={label}
          value={currentValue}
          defaultValue={defaultValue}
          details={details ?? helpText}
          error={error}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          requiredIndicator={requiredIndicator}
          autoComplete={autoComplete}
          labelAccessibilityVisibility={labelAccessibilityVisibility}
          className={className}
          onChange={handleTextChange}
          onBlur={onBlur}
          onFocus={handleFocus}
          {...rest}
        >
          {prefix ?? swatch}
          {suffix ? <Box slot="suffix">{suffix}</Box> : null}
        </TextField>

        <FlexPopover
          anchorRef={fieldRef}
          isOpen={open}
          onClose={handleClose}
          position="bottom-start"
          padding="small"
          noHeader
          maxHeight="none"
        >
          <SColorPicker
            value={currentValue}
            alpha={alpha}
            onInput={handlePickerInput}
            onChange={handlePickerInput}
          />
        </FlexPopover>
      </>
    );
  },
);
