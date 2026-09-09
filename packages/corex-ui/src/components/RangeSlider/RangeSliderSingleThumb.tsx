import type { CSSProperties } from "react";
import { RangeSliderLabelled } from "./RangeSliderLabelled";
import type { RangeSliderSingleThumbPropsType } from "./RangeSlider.types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function RangeSliderSingleThumb(props: RangeSliderSingleThumbPropsType) {
  const {
    id,
    error,
    helpText,
    value,
    min,
    max,
    disabled,
    output,
    prefix,
    suffix,
    label,
    labelAction,
    labelHidden,
    step,
    onChange,
    onBlur,
    onFocus,
    className,
    style,
  } = props;

  const clampedValue = clamp(value, min, max);
  const describedBy: string[] = [];
  if (error) describedBy.push(`${id}Error`);
  if (helpText) describedBy.push(`${id}HelpText`);
  const ariaDescribedBy = describedBy.length ? describedBy.join(" ") : undefined;

  const progress = max === min ? 0 : ((clampedValue - min) / (max - min)) * 100;
  const thumbOffset = (0.5 - progress / 100) * 16;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.currentTarget.value), id);
  };

  return (
    <RangeSliderLabelled
      id={id}
      label={label}
      labelAction={labelAction}
      labelHidden={labelHidden}
      helpText={helpText}
      error={error}
    >
      <div
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: 28,
          display: "flex",
          alignItems: "center",
          "--p-color-border": "#cccccc",
          "--p-color-bg-fill-brand": "#303030",
          "--p-color-bg-surface": "#ffffff",
          ...style,
        }}
      >
        {prefix ? <div style={{ flex: "0 0 auto", marginRight: 8 }}>{prefix}</div> : null}

        <div
          className="corex-range-slider-wrapper"
          style={{
            position: "relative",
            width: "100%",
            height: 28,
            display: "flex",
            alignItems: "center",
            flex: "1 1 auto",
          }}
        >
          {/* Dashed track */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 4,
              width: "100%",
              backgroundImage:
                "linear-gradient(to right, var(--p-color-border), var(--p-color-border) 50%, transparent 50%, transparent 100%)",
              backgroundSize: "4px 4px",
              borderRadius: 999,
              borderRight: "4px var(--p-color-border) solid",
              pointerEvents: "none",
            }}
          />

          {/* Active progress */}
          <div
            style={{
              position: "absolute",
              left: 0,
              width: `${progress}%`,
              height: 4,
              background: disabled
                ? "var(--p-color-border)"
                : error
                  ? "var(--p-color-text-critical, #d72c0d)"
                  : "var(--p-color-bg-fill-brand)",
              borderRadius: 999,
              pointerEvents: "none",
            }}
          />

          {/* Native input */}
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={clampedValue}
            disabled={disabled}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-label={labelHidden && typeof label === "string" ? label : undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={clampedValue}
            aria-invalid={Boolean(error)}
            aria-describedby={ariaDescribedBy}
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              margin: 0,
              appearance: "none",
              WebkitAppearance: "none",
              background: "transparent",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          />

          {/* Output tooltip bubble */}
          {output && !disabled && (
            <output
              htmlFor={id}
              role="status"
              aria-live="off"
              className="corex-range-slider-output"
              style={{
                position: "absolute",
                left: `calc(${progress}% + ${thumbOffset}px)`,
                bottom: "calc(100% + 6px)",
                transform: "translateX(-50%)",
                zIndex: 10,
                pointerEvents: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 26,
                padding: "3px 7px",
                borderRadius: 5,
                background: error
                  ? "var(--p-color-text-critical, #d72c0d)"
                  : "var(--p-color-bg-fill-brand, #303030)",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: 1,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.18)",
                userSelect: "none",
              }}
            >
              {clampedValue}
              <span
                style={{
                  position: "absolute",
                  bottom: -3,
                  left: "50%",
                  transform: "translateX(-50%) rotate(45deg)",
                  width: 6,
                  height: 6,
                  background: error
                    ? "var(--p-color-text-critical, #d72c0d)"
                    : "var(--p-color-bg-fill-brand, #303030)",
                }}
              />
            </output>
          )}
        </div>

        {suffix ? <div style={{ flex: "0 0 auto", marginLeft: 8 }}>{suffix}</div> : null}

        <style>{`
          .corex-range-slider-wrapper .corex-range-slider-output {
            opacity: 0;
            transform: translateX(-50%) translateY(2px);
            transition: opacity 150ms ease, transform 150ms ease;
          }

          .corex-range-slider-wrapper:hover .corex-range-slider-output,
          .corex-range-slider-wrapper:focus-within .corex-range-slider-output,
          input[id="${id}"]:active ~ .corex-range-slider-output {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }

          input[id="${id}"]::-webkit-slider-runnable-track {
            height: 4px;
            background: transparent;
          }

          input[id="${id}"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            margin-top: -6px;
            border-radius: 50%;
            background: ${error ? "var(--p-color-text-critical, #d72c0d)" : "var(--p-color-bg-fill-brand)"};
            border: 0px solid var(--p-color-bg-surface);
            box-shadow: 0 0 16px -3px var(--p-color-border);
            cursor: ${disabled ? "not-allowed" : "grab"};
            transition: transform 150ms ease;
          }

          input[id="${id}"]::-webkit-slider-thumb:active {
            cursor: ${disabled ? "not-allowed" : "grabbing"};
            transform: scale(1.25);
            outline: 2px solid var(--p-color-bg-fill-brand);
            outline-offset: 1px;
          }

          input[id="${id}"]::-moz-range-track {
            height: 4px;
            background: transparent;
          }

          input[id="${id}"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${error ? "var(--p-color-text-critical, #d72c0d)" : "var(--p-color-bg-fill-brand)"};
            border: 0px solid var(--p-color-bg-surface);
            box-shadow: 0 0 16px -3px var(--p-color-border);
            cursor: ${disabled ? "not-allowed" : "pointer"};
            transition: transform 150ms ease;
          }

          input[id="${id}"]::-moz-range-thumb:active {
            transform: scale(1.25);
          }
        `}</style>
      </div>
    </RangeSliderLabelled>
  );
}
