import type { ReactNode } from "react";
import { Text } from "../Text";
import type { RangeSliderLabelActionType } from "./RangeSlider.types";

const VISUALLY_HIDDEN_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

export type RangeSliderLabelledPropsType = {
  id: string;
  label?: ReactNode;
  labelAction?: RangeSliderLabelActionType;
  labelHidden?: boolean;
  helpText?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
};

/** Renders the label/action row, the control, and help/error text below it. */
export function RangeSliderLabelled({
  id,
  label,
  labelAction,
  labelHidden,
  helpText,
  error,
  children,
}: RangeSliderLabelledPropsType) {
  const helpTextId = `${id}HelpText`;
  const errorId = `${id}Error`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {label ? (
        <div
          style={
            labelHidden
              ? VISUALLY_HIDDEN_STYLE
              : { display: "flex", alignItems: "center", justifyContent: "space-between" }
          }
        >
          <label htmlFor={id} id={`${id}Label`}>
            <Text as="span" variant="small">
              {label}
            </Text>
          </label>
          {labelAction ? (
            <button
              type="button"
              onClick={labelAction.onAction}
              aria-label={labelAction.accessibilityLabel}
              style={{
                background: "none",
                border: 0,
                padding: 0,
                margin: 0,
                cursor: "pointer",
                font: "inherit",
                color: "var(--p-color-text-info, #2c6ecb)",
              }}
            >
              <Text as="span" variant="small">
                {labelAction.content}
              </Text>
            </button>
          ) : null}
        </div>
      ) : null}
      {children}
      {helpText ? (
        <Text as="span" variant="small" color="subdued" id={helpTextId}>
          {helpText}
        </Text>
      ) : null}
      {error ? (
        <Text as="span" variant="small" tone="critical" id={errorId}>
          {error}
        </Text>
      ) : null}
    </div>
  );
}
