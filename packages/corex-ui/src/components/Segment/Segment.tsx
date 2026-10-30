import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactElement,
} from "react";
import { mergeRefs } from "../../core/mergeRefs";
import { useIsomorphicLayoutEffect } from "../../core/useIsomorphicLayoutEffect";
import { SEGMENT_CSS, SEGMENT_STYLE_ID } from "./Segment.css";
import type { SegmentComponentType, SegmentPropsType } from "./Segment.types";

function ensureStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  if (!doc) return;
  const existing = doc.getElementById(SEGMENT_STYLE_ID);
  if (existing) {
    if (existing.textContent !== SEGMENT_CSS) {
      existing.textContent = SEGMENT_CSS;
    }
    return;
  }
  const style = doc.createElement("style");
  style.id = SEGMENT_STYLE_ID;
  style.textContent = SEGMENT_CSS;
  doc.head.appendChild(style);
}

function SegmentInner<TValue extends string = string>(
  {
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    label,
    variant = "default",
    size = "base",
    inlineSize = "auto",
    disabled = false,
    name,
    id,
    accessibilityLabel,
    className,
    style,
  }: SegmentPropsType<TValue>,
  ref: ForwardedRef<HTMLDivElement>,
): ReactElement {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const generatedId = useId();
  const labelId = label
    ? `${id ?? `cx-segment-${generatedId.replace(/:/g, "")}`}-label`
    : undefined;

  useIsomorphicLayoutEffect(() => ensureStyles(nodeRef.current), []);

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<TValue | undefined>(
    defaultValue,
  );
  const selectedValue = (isControlled ? controlledValue : uncontrolledValue) as
    | TValue
    | undefined;

  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const hasSelection = selectedIndex >= 0;

  const selectValue = useCallback(
    (next: TValue) => {
      if (disabled) return;
      const option = options.find((item) => item.value === next);
      if (!option || option.disabled) return;
      if (!isControlled) setUncontrolledValue(next);
      onChange?.(next);
    },
    [disabled, isControlled, onChange, options],
  );

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const moveSelection = (direction: 1 | -1) => {
    if (disabled || options.length === 0) return;
    const start = hasSelection ? selectedIndex : direction === 1 ? -1 : options.length;
    for (let step = 1; step <= options.length; step += 1) {
      const nextIndex =
        (start + direction * step + options.length * 2) % options.length;
      const option = options[nextIndex];
      if (option && !option.disabled) {
        selectValue(option.value);
        focusOption(nextIndex);
        return;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveSelection(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveSelection(-1);
        break;
      case "Home": {
        event.preventDefault();
        const firstEnabled = options.find((option) => !option.disabled);
        if (firstEnabled) {
          selectValue(firstEnabled.value);
          focusOption(options.indexOf(firstEnabled));
        }
        break;
      }
      case "End": {
        event.preventDefault();
        const lastEnabled = [...options].reverse().find((option) => !option.disabled);
        if (lastEnabled) {
          selectValue(lastEnabled.value);
          focusOption(options.indexOf(lastEnabled));
        }
        break;
      }
      default:
        break;
    }
  };

  const cssVars = {
    "--cx-segment-count": Math.max(options.length, 1),
    "--cx-segment-index": hasSelection ? selectedIndex : 0,
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={mergeRefs(nodeRef, ref)}
      id={id}
      className={className}
      style={cssVars}
      data-slot="segment"
      data-variant={variant}
      data-size={size}
      data-inline-size={inlineSize}
      data-disabled={disabled ? "true" : undefined}
      data-has-selection={hasSelection ? "true" : "false"}
    >
      {label != null && label !== false && label !== "" ? (
        <span data-slot="segment-label" id={labelId}>
          {label}
        </span>
      ) : null}

      <div
        data-slot="segment-track"
        role="radiogroup"
        aria-labelledby={labelId}
        aria-label={labelId ? undefined : accessibilityLabel}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
      >
        <div data-slot="segment-thumb" aria-hidden="true" />

        {options.map((option, index) => {
          const isSelected = option.value === selectedValue;
          const isOptionDisabled = disabled || Boolean(option.disabled);

          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              data-slot="segment-option"
              name={name}
              value={option.value}
              aria-checked={isSelected}
              aria-label={option.accessibilityLabel}
              disabled={isOptionDisabled}
              tabIndex={
                isOptionDisabled
                  ? -1
                  : isSelected || (!hasSelection && index === 0)
                    ? 0
                    : -1
              }
              onClick={() => selectValue(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Pill segmented control for mutually exclusive options.
 * Supports a white elevated thumb (`variant="default"`) or a dark filled thumb
 * (`variant="primary"`), with an optional label shown only when provided.
 */
export const Segment = forwardRef(SegmentInner) as unknown as SegmentComponentType;
Segment.displayName = "Segment";

export default Segment;
